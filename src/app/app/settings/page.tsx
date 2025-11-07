import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setDocumentMeta } from '@/lib/seo';
import { NotificationPreferences, SubscriptionDetails, UserSettings } from '@/lib/types';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { BillingSettings } from '@/components/settings/BillingSettings';
import { toast } from 'sonner';

export default function Settings() {
  const { t } = useTranslation();

  useEffect(() => {
    setDocumentMeta({
      title: 'Settings - AURA',
      description: 'Manage your account settings and preferences.',
    });
  }, []);

  const [user] = useState<UserSettings>({
    email: 'user@example.com'
  });

  const [notifications, setNotifications] = useState<NotificationPreferences>({
    newJobRecommendations: true,
    applicationStatusUpdates: true,
    insightsAndTips: false
  });

  const [subscription] = useState<SubscriptionDetails | null>({
    planName: 'AURA Plus',
    planId: 'plus',
    billingInterval: 'monthly',
    nextBillingDate: '2025-12-06',
    nextBillingAmount: 29.99,
    currency: 'USD',
    paymentMethodSummary: 'Visa ending in 1234'
  });

  const handleExportData = () => {
    toast.success(t('settingsPage.account.exportSuccess'));
  };

  const handleDeleteAccount = () => {
    toast.error(t('settingsPage.account.deleteSuccess'));
  };

  const handleSaveNotifications = () => {
    toast.success(t('settingsPage.notifications.saveSuccess'));
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <header className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          {t('settingsPage.header.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('settingsPage.header.subtitle')}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto space-y-6">
        <AccountSettings
          user={user}
          labels={{
            heading: t('settingsPage.account.heading'),
            emailLabel: t('settingsPage.account.emailLabel'),
            changePasswordLabel: t('settingsPage.account.changePasswordLabel'),
            exportDataLabel: t('settingsPage.account.exportDataLabel'),
            exportDataHelper: t('settingsPage.account.exportDataHelper'),
            dangerZoneHeading: t('settingsPage.account.dangerZoneHeading'),
            deleteAccountLabel: t('settingsPage.account.deleteAccountLabel'),
            deleteAccountWarning: t('settingsPage.account.deleteAccountWarning'),
            deleteAccountConfirmTitle: t('settingsPage.account.deleteAccountConfirmTitle'),
            deleteAccountConfirmBody: t('settingsPage.account.deleteAccountConfirmBody'),
            deleteAccountConfirmPlaceholder: t('settingsPage.account.deleteAccountConfirmPlaceholder'),
            deleteAccountConfirmButton: t('settingsPage.account.deleteAccountConfirmButton'),
            deleteAccountCancelButton: t('settingsPage.account.deleteAccountCancelButton'),
          }}
          onExportData={handleExportData}
          onDeleteAccount={handleDeleteAccount}
        />

        <NotificationSettings
          value={notifications}
          labels={{
            heading: t('settingsPage.notifications.heading'),
            description: t('settingsPage.notifications.description'),
            newJobRecommendations: t('settingsPage.notifications.newJobRecommendations'),
            applicationStatusUpdates: t('settingsPage.notifications.applicationStatusUpdates'),
            insightsAndTips: t('settingsPage.notifications.insightsAndTips'),
            saveButton: t('settingsPage.notifications.saveButton'),
          }}
          onChange={setNotifications}
          onSubmit={handleSaveNotifications}
        />

        <BillingSettings
          subscription={subscription}
          labels={{
            heading: t('settingsPage.billing.heading'),
            noSubscriptionMessage: t('settingsPage.billing.noSubscriptionMessage'),
            currentPlanLabel: t('settingsPage.billing.currentPlanLabel'),
            billingCycleLabel: t('settingsPage.billing.billingCycleLabel'),
            nextBillingLabel: t('settingsPage.billing.nextBillingLabel'),
            paymentMethodLabel: t('settingsPage.billing.paymentMethodLabel'),
            changePlanLabel: t('settingsPage.billing.changePlanLabel'),
            updatePaymentMethodLabel: t('settingsPage.billing.updatePaymentMethodLabel'),
            viewBillingHistoryLabel: t('settingsPage.billing.viewBillingHistoryLabel'),
            cancelSubscriptionLabel: t('settingsPage.billing.cancelSubscriptionLabel'),
          }}
        />
      </div>
    </div>
  );
}