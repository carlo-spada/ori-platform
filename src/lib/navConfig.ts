import {
  LucideIcon,
  LayoutDashboard,
  User,
  Sparkles,
  FileText,
  Settings,
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/app/profile', label: 'Profile & Goals', icon: User },
  { href: '/app/recommendations', label: 'Recommendations', icon: Sparkles },
  { href: '/app/applications', label: 'Applications', icon: FileText },
  { href: '/app/settings', label: 'Settings', icon: Settings },
]

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface WhatsNextData {
  title: string
  message: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
}

export interface DashboardProps {
  userName: string
  whatsNext: WhatsNextData
  chatHistory: ChatMessage[]
}
