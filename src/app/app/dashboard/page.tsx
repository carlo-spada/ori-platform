'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { setDocumentMeta } from '@/lib/seo';
import { useAuth } from '@/contexts/AuthProvider';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { WhatsNextCard } from '@/components/dashboard/WhatsNextCard';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { RecentActivity, type ActivityItem } from '@/components/dashboard/RecentActivity';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatMessage } from '@/lib/navConfig';
import { fetchChatHistory, sendChatMessage, mapBackendMessageToFrontend } from '@/integrations/api/chat';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const queryClient = useQueryClient();
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  // Fetch chat history
  const { data: chatData, isLoading: isChatLoading } = useQuery({
    queryKey: ['chat-history'],
    queryFn: fetchChatHistory,
    enabled: !!user,
  });

  // Extract messages and conversation ID from chat data
  const chatMessages: ChatMessage[] = chatData?.messages?.map(mapBackendMessageToFrontend) || [];

  // Update conversation ID when data loads
  useEffect(() => {
    if (chatData?.conversation?.id) {
      setConversationId(chatData.conversation.id);
    }
  }, [chatData]);

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => sendChatMessage(content, conversationId),
    onMutate: async (content) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['chat-history'] });

      // Snapshot previous value
      const previousChat = queryClient.getQueryData(['chat-history']);

      // Optimistically update with user message
      queryClient.setQueryData(['chat-history'], (old: any) => ({
        ...old,
        messages: [
          ...(old?.messages || []),
          {
            id: `temp-${Date.now()}`,
            conversation_id: conversationId || 'temp',
            role: 'user',
            content,
            created_at: new Date().toISOString(),
          },
        ],
      }));

      return { previousChat };
    },
    onSuccess: (data) => {
      // Update conversation ID if this was the first message
      if (!conversationId && data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      // Update cache with assistant's response
      queryClient.setQueryData(['chat-history'], (old: any) => ({
        ...old,
        conversation: old?.conversation || { id: data.conversation_id },
        messages: [
          ...(old?.messages || []).filter((m: any) => !m.id.startsWith('temp-')),
          data.message,
        ],
      }));
    },
    onError: (err, newMessage, context: any) => {
      // Rollback on error
      if (context?.previousChat) {
        queryClient.setQueryData(['chat-history'], context.previousChat);
      }
      console.error('Failed to send message:', err);
    },
  });

  // Mock data for QuickStats (will be replaced with real data)
  const stats = {
    activeApplications: 3,
    jobRecommendations: 12,
    skillsAdded: 8,
    profileCompletion: 85,
  };

  // Mock data for RecentActivity (will be replaced with real data)
  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'application',
      title: 'Applied to Senior Product Manager',
      subtitle: 'Google Inc.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: '2',
      type: 'skill',
      title: 'Added new skill',
      subtitle: 'TypeScript',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    },
    {
      id: '3',
      type: 'favorite',
      title: 'Saved job',
      subtitle: 'Lead Designer at Meta',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      id: '4',
      type: 'profile',
      title: 'Updated your profile',
      subtitle: 'Added work experience',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
  ];

  const whatsNext = {
    title: t('dashboardPage.whatsNext.defaultTitle'),
    message: t('dashboardPage.whatsNext.defaultMessage'),
    primaryCtaLabel: t('dashboardPage.whatsNext.defaultPrimaryCtaLabel'),
    primaryCtaHref: t('dashboardPage.whatsNext.defaultPrimaryCtaHref'),
    secondaryCtaLabel: t('dashboardPage.whatsNext.defaultSecondaryCtaLabel'),
    secondaryCtaHref: t('dashboardPage.whatsNext.defaultSecondaryCtaHref'),
  };

  useEffect(() => {
    setDocumentMeta({
      title: 'Dashboard - Ori Platform',
      description: 'Your Ori dashboard - track your career journey and view personalized insights.',
    });
  }, []);

  // Handler for sending messages
  const handleSendMessage = (message: string) => {
    sendMessageMutation.mutate(message);
  };

  return (
    <div className="h-full flex flex-col gap-6" data-testid="dashboard-page">
      {/* Header */}
      <DashboardHeader userName={userName} />

      {/* Quick Stats */}
      <QuickStats {...stats} />

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 lg:gap-6 overflow-hidden min-h-0">
        {/* Left Column */}
        <div className="flex flex-col gap-4 lg:gap-6 overflow-hidden min-h-0">
          <div className="flex-1 min-h-0">
            <WhatsNextCard {...whatsNext} />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 lg:gap-6 overflow-hidden min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <RecentActivity activities={recentActivities} />
          </div>
          <div className="h-96 lg:h-auto lg:flex-1 min-h-0">
            <ChatWindow
              messages={chatMessages}
              onSend={handleSendMessage}
              isLoading={isChatLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}