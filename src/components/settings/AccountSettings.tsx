import { useState } from 'react'
import { UserSettings } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTranslation } from 'react-i18next'
import { DeleteAccountModal } from './DeleteAccountModal'

interface AccountSettingsProps {
  user: UserSettings
  labels: {
    heading: string
    emailLabel: string
    changePasswordLabel: string
    exportDataLabel: string
    exportDataHelper: string
    logoutLabel?: string
    dangerZoneHeading: string
    deleteAccountLabel: string
    deleteAccountWarning: string
    deleteAccountConfirmTitle: string
    deleteAccountConfirmBody: string
    deleteAccountConfirmPlaceholder: string
    deleteAccountConfirmButton: string
    deleteAccountCancelButton: string
  }
  onExportData?: () => void
  onLogout?: () => void
  onDeleteAccount?: () => void
}

export function AccountSettings({
  user,
  labels,
  onExportData,
  onLogout,
  onDeleteAccount,
}: AccountSettingsProps) {
  const { t } = useTranslation()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  return (
    <>
      <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
        <h2 className="text-foreground text-xl font-semibold">
          {labels.heading}
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-foreground text-sm font-medium"
            >
              {labels.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              readOnly
              className="text-foreground w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm opacity-70"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="flex-1">
                  <Button variant="outline" disabled className="w-full">
                    {labels.changePasswordLabel}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>{t('tooltips.comingSoon')}</TooltipContent>
            </Tooltip>
            <Button variant="outline" onClick={onExportData} className="flex-1">
              {labels.exportDataLabel}
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            {labels.exportDataHelper}
          </p>

          {onLogout && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={onLogout}
                className="w-full"
              >
                {labels.logoutLabel || 'Log out'}
              </Button>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="mt-4 space-y-2 rounded-xl border border-red-500/40 bg-red-500/5 p-4">
          <h3 className="text-sm font-semibold text-red-400">
            {labels.dangerZoneHeading}
          </h3>
          <p className="text-xs text-red-200/80">
            {labels.deleteAccountWarning}
          </p>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
            className="mt-2"
          >
            {labels.deleteAccountLabel}
          </Button>
        </div>
      </section>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          onDeleteAccount?.()
          setIsDeleteModalOpen(false)
        }}
        labels={{
          title: labels.deleteAccountConfirmTitle,
          body: labels.deleteAccountConfirmBody,
          placeholder: labels.deleteAccountConfirmPlaceholder,
          confirmButton: labels.deleteAccountConfirmButton,
          cancelButton: labels.deleteAccountCancelButton,
        }}
      />
    </>
  )
}
