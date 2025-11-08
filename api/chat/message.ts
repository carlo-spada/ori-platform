import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../services/core-api/src/lib/supabase.js'
import { authMiddleware } from '../../services/core-api/src/middleware/auth.js'
import { aiClient } from '../../services/core-api/src/lib/ai-client.js'

// Placeholder function from the original file
function generatePlaceholderResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm Ori, your AI career companion. How can I help you with your career journey today?"
  }
  if (lowerMessage.includes('job') || lowerMessage.includes('career')) {
    return 'I can help you explore job opportunities, analyze skill gaps, and provide personalized career guidance. What specifically would you like to know?'
  }
  return `I understand you're interested in: "${userMessage}". While I'm currently in development mode, I'll be able to provide more intelligent responses soon!`
}

// @ts-ignore
const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  // @ts-ignore
  await authMiddleware(req, res, async () => {
    // @ts-ignore
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    const { content, conversation_id } = req.body

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content is required' })
    }

    try {
      let conversationId = conversation_id

      if (!conversationId) {
        // @ts-ignore
        const { data: newConversation, error: convError } = await supabase
          .from('conversations')
          .insert([{ user_id: req.user.id }])
          .select()
          .single()

        if (convError || !newConversation) {
          console.error('Error creating conversation:', convError)
          return res
            .status(500)
            .json({ error: 'Failed to create conversation' })
        }
        conversationId = newConversation.id
      } else {
        const { data: existingConv, error: checkError } = await supabase
          .from('conversations')
          .select('id')
          .eq('id', conversationId)
          // @ts-ignore
          .eq('user_id', req.user.id)
          .single()

        if (checkError || !existingConv) {
          return res
            .status(403)
            .json({ error: 'Conversation not found or access denied' })
        }
      }

      const { data: userMessage, error: userMsgError } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            role: 'user',
            content: content.trim(),
          },
        ])
        .select()
        .single()

      if (userMsgError || !userMessage) {
        console.error('Error saving user message:', userMsgError)
        return res.status(500).json({ error: 'Failed to save message' })
      }

      // @ts-ignore
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('skills, target_roles')
        // @ts-ignore
        .eq('user_id', req.user.id)
        .single()

      const skills = (userProfile?.skills as string[]) || []
      const targetRoles = (userProfile?.target_roles as string[]) || []

      const { data: recentMessages } = await supabase
        .from('messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(10)

      const messageHistory = (recentMessages || [])
        .reverse()
        .map((msg: { role: 'user' | 'assistant'; content: string }) => ({
          role: msg.role,
          content: msg.content,
        }))

      let assistantContent: string
      try {
        const aiResponse = await aiClient.generateResponse(
          { skills, target_roles: targetRoles },
          messageHistory,
          content.trim(),
        )
        assistantContent = aiResponse.content
      } catch (aiError) {
        console.error(
          'AI generation failed, falling back to placeholder:',
          aiError,
        )
        assistantContent = generatePlaceholderResponse(content.trim())
      }

      const { data: assistantMessage, error: assistantMsgError } =
        await supabase
          .from('messages')
          .insert([
            {
              conversation_id: conversationId,
              role: 'assistant',
              content: assistantContent,
            },
          ])
          .select()
          .single()

      if (assistantMsgError || !assistantMessage) {
        console.error('Error saving assistant message:', assistantMsgError)
        return res
          .status(500)
          .json({ error: 'Failed to save assistant response' })
      }

      return res.status(200).json({
        message: assistantMessage,
        conversation_id: conversationId,
      })
    } catch (error) {
      console.error('Unexpected error sending message:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })
}

export default handler
