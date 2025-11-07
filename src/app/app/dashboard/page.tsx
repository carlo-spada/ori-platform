'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setDocumentMeta } from '@/lib/seo';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { WhatsNextCard } from '@/components/dashboard/WhatsNextCard';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatMessage } from '@/lib/navConfig';

export default function Dashboard() {
  const { t } = useTranslation();
  const [userName] = useState('User');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: t('dashboardPage.chat.initialMessage'),
      timestamp: new Date().toISOString(),
    },
  ]);

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
      title: 'Dashboard - AURA',
      description: 'Your AURA dashboard - track your career journey and view personalized insights.',
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
    <div className="h-full flex flex-col" data-testid="dashboard-page">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1.7fr_1fr] gap-4 lg:gap-6 overflow-hidden min-h-0">
        <div className="flex flex-col overflow-hidden min-h-0">
          <DashboardHeader userName={userName} />
          <div className="flex-1 min-h-0">
            <WhatsNextCard {...whatsNext} />
          </div>
        </div>
        <div className="flex flex-col overflow-hidden min-h-0 h-full md:h-auto">
          <ChatWindow messages={chatHistory} onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}