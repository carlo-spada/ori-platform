'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { setDocumentMeta } from '@/lib/seo'
import { useAuth } from '@/contexts/AuthProvider'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { WhatsNextCard } from '@/components/dashboard/WhatsNextCard'
import { QuickStats } from '@/components/dashboard/QuickStats'
import {
  RecentActivity,
  type ActivityItem,
} from '@/components/dashboard/RecentActivity'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { ChatMessage } from '@/lib/navConfig'
import {
  fetchChatHistory,
  sendChatMessage,
  mapBackendMessageToFrontend,
} from '@/integrations/api/chat'
import { fetchDashboardData } from '@/integrations/api/dashboard'

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const userName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const queryClient = useQueryClient()
  const conversationId = useRef<string | undefined>(undefined)

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    enabled: !!user,
  })

  // Fetch chat history
  const { data: chatData, isLoading: isChatLoading } = useQuery({
    queryKey: ['chat-history'],
    queryFn: fetchChatHistory,
    enabled: !!user,
  })

  // Extract messages and conversation ID from chat data
  const chatMessages: ChatMessage[] =
    chatData?.messages?.map(mapBackendMessageToFrontend) || []

  // Update conversation ID when data loads
  useEffect(() => {
    if (chatData?.conversation?.id) {
      conversationId.current = chatData.conversation.id
    }
  }, [chatData])

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      sendChatMessage(content, conversationId.current),
    onMutate: async (content) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['chat-history'] })

      // Snapshot previous value
      const previousChat = queryClient.getQueryData(['chat-history'])

      // Optimistically update with user message
      queryClient.setQueryData(
        ['chat-history'],
        (
          old: { conversation?: { id: string }; messages?: ChatMessage[] } = {},
        ) => ({
          ...old,
          messages: [
            ...(old?.messages || []),
            {
              id: `temp-${Date.now()}`,
              conversation_id: conversationId.current || 'temp',
              role: 'user' as const,
              content,
              created_at: new Date().toISOString(),
            },
          ],
        }),
      )

      return { previousChat }
    },
    onSuccess: (data) => {
      // Update conversation ID if this was the first message
      if (!conversationId.current && data.conversation_id) {
        conversationId.current = data.conversation_id
      }

      // Update cache with assistant's response
      queryClient.setQueryData(
        ['chat-history'],
        (
          old: { conversation?: { id: string }; messages?: ChatMessage[] } = {},
        ) => ({
          ...old,
          conversation: old?.conversation || { id: data.conversation_id },
          messages: [
            ...(old?.messages || []).filter((m) => !m.id.startsWith('temp-')),
            data.message,
          ],
        }),
      )
    },
    onError: (
      err,
      newMessage,
      context: { previousChat?: unknown } | undefined,
    ) => {
      // Rollback on error
      if (context?.previousChat) {
        queryClient.setQueryData(['chat-history'], context.previousChat)
      }
      console.error('Failed to send message:', err)
    },
  })

  // Extract real data from dashboard API
  const stats = dashboardData?.stats || {
    activeApplications: 0,
    jobRecommendations: 0,
    skillsAdded: 0,
    profileCompletion: 0,
  }

  const recentActivities: ActivityItem[] = dashboardData?.recentActivity || []

  const whatsNext = {
    title: t('dashboardPage.whatsNext.defaultTitle'),
    message: t('dashboardPage.whatsNext.defaultMessage'),
    primaryCtaLabel: t('dashboardPage.whatsNext.defaultPrimaryCtaLabel'),
    primaryCtaHref: t('dashboardPage.whatsNext.defaultPrimaryCtaHref'),
    secondaryCtaLabel: t('dashboardPage.whatsNext.defaultSecondaryCtaLabel'),
    secondaryCtaHref: t('dashboardPage.whatsNext.defaultSecondaryCtaHref'),
  }

  useEffect(() => {
    setDocumentMeta({
      title: 'Dashboard - Ori Platform',
      description:
        'Your Ori dashboard - track your career journey and view personalized insights.',
    })
  }, [])

  // Handler for sending messages
  const handleSendMessage = (message: string) => {
    sendMessageMutation.mutate(message)
  }

  // Show loading state while dashboard data is fetching
  if (isDashboardLoading) {
    return (
      <div
        className="flex h-full items-center justify-center"
        data-testid="dashboard-loading"
      >
        <div className="text-center text-muted-foreground">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-6" data-testid="dashboard-page">
      {/* Header */}
      <DashboardHeader userName={userName} />

      {/* Quick Stats */}
      <QuickStats {...stats} />

      {/* Main Content Grid */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[1.5fr_1fr] lg:gap-6">
        {/* Left Column */}
        <div className="flex min-h-0 flex-col gap-4 overflow-hidden lg:gap-6">
          <div className="min-h-0 flex-1">
            <WhatsNextCard {...whatsNext} />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex min-h-0 flex-col gap-4 overflow-hidden lg:gap-6">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <RecentActivity activities={recentActivities} />
          </div>
          <div className="h-96 min-h-0 lg:h-auto lg:flex-1">
            <ChatWindow
              messages={chatMessages}
              onSend={handleSendMessage}
              isLoading={isChatLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
