import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../services/core-api/src/lib/supabase.js'
import { authMiddleware } from '../../services/core-api/src/middleware/auth.js'

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  await authMiddleware(req, res, async () => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    try {
      // Fetch the most recent conversation for this user
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', req.user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (convError && convError.code === 'PGRST116') {
        return res.status(200).json({
          conversation: null,
          messages: [],
        })
      }

      if (convError) {
        console.error('Error fetching conversation:', convError)
        return res.status(500).json({ error: 'Failed to fetch conversation' })
      }

      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true })

      if (messagesError) {
        console.error('Error fetching messages:', messagesError)
        return res.status(500).json({ error: 'Failed to fetch messages' })
      }

      return res.status(200).json({
        conversation,
        messages: messages || [],
      })
    } catch (error) {
      console.error('Unexpected error fetching chat history:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })
}

export default handler
