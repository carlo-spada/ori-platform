'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setDocumentMeta } from '@/lib/seo';
import { useAuth } from '@/contexts/AuthProvider';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { WhatsNextCard } from '@/components/dashboard/WhatsNextCard';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { RecentActivity, type ActivityItem } from '@/components/dashboard/RecentActivity';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatMessage } from '@/lib/navConfig';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: t('dashboardPage.chat.initialMessage'),
      timestamp: new Date().toISOString(),
    },
  ]);

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

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('dashboardPage.chat.responseMessage'),
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, aiMessage]);
    }, 1000);
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
            <ChatWindow messages={chatHistory} onSend={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}