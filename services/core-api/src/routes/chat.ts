import { Router, type Router as RouterType } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { supabase } from '../lib/supabase.js';

const router: RouterType = Router();

/**
 * GET /api/v1/chat/history
 * Fetches the most recent conversation and its messages for the authenticated user.
 * Returns an empty array if no conversation exists.
 */
router.get('/history', authMiddleware, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    // Fetch the most recent conversation for this user
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', req.user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    // If no conversation exists yet, return empty state
    if (convError && convError.code === 'PGRST116') {
      return res.status(200).json({
        conversation: null,
        messages: [],
      });
    }

    if (convError) {
      console.error('Error fetching conversation:', convError);
      return res.status(500).json({ error: 'Failed to fetch conversation' });
    }

    // Fetch all messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }

    return res.status(200).json({
      conversation,
      messages: messages || [],
    });
  } catch (error) {
    console.error('Unexpected error fetching chat history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/v1/chat/message
 * Receives a new user message, saves it, generates an assistant response,
 * and returns the assistant's message.
 *
 * Request body: { content: string, conversation_id?: string }
 * Response: { message: ChatMessage, conversation_id: string }
 */
router.post('/message', authMiddleware, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const { content, conversation_id } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  try {
    let conversationId = conversation_id;

    // If no conversation_id provided, create a new conversation
    if (!conversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert([
          {
            user_id: req.user.id,
          },
        ])
        .select()
        .single();

      if (convError || !newConversation) {
        console.error('Error creating conversation:', convError);
        return res.status(500).json({ error: 'Failed to create conversation' });
      }

      conversationId = newConversation.id;
    } else {
      // Verify the conversation belongs to this user
      const { data: existingConv, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', conversationId)
        .eq('user_id', req.user.id)
        .single();

      if (checkError || !existingConv) {
        return res.status(403).json({ error: 'Conversation not found or access denied' });
      }
    }

    // Save the user's message
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
      .single();

    if (userMsgError || !userMessage) {
      console.error('Error saving user message:', userMsgError);
      return res.status(500).json({ error: 'Failed to save message' });
    }

    // Generate a placeholder AI response
    // In future tasks, this will be replaced with actual AI model integration
    const assistantContent = generatePlaceholderResponse(content.trim());

    // Save the assistant's response
    const { data: assistantMessage, error: assistantMsgError } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          role: 'assistant',
          content: assistantContent,
        },
      ])
      .select()
      .single();

    if (assistantMsgError || !assistantMessage) {
      console.error('Error saving assistant message:', assistantMsgError);
      return res.status(500).json({ error: 'Failed to save assistant response' });
    }

    return res.status(200).json({
      message: assistantMessage,
      conversation_id: conversationId,
    });
  } catch (error) {
    console.error('Unexpected error sending message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Placeholder AI response generator.
 * This will be replaced with actual AI model integration in future tasks.
 */
function generatePlaceholderResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Simple rule-based responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm Ori, your AI career companion. How can I help you with your career journey today?";
  }

  if (lowerMessage.includes('job') || lowerMessage.includes('career')) {
    return "I can help you explore job opportunities, analyze skill gaps, and provide personalized career guidance. What specifically would you like to know?";
  }

  if (lowerMessage.includes('skill')) {
    return "Skills are crucial for your career growth! I can help you identify skill gaps and recommend learning paths. Would you like me to analyze your skills for a specific role?";
  }

  if (lowerMessage.includes('help')) {
    return "I'm here to help with your career journey! You can ask me about job recommendations, skill development, application strategies, or career planning. What would you like to explore?";
  }

  // Default echo-style response
  return `I understand you're interested in: "${userMessage}". While I'm currently in development mode, I'll be able to provide more intelligent responses soon! In the meantime, feel free to explore your dashboard for job recommendations and skill analysis.`;
}

export default router;
