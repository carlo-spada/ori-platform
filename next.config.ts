import type { NextConfig } from 'next'
import withPWAInit from '@ducanh2912/next-pwa'

const isPWAEnabled = process.env.NEXT_ENABLE_PWA === 'true'

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development' || !isPWAEnabled,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
})

const nextConfig: NextConfig = {
  // Explicitly declare Turbopack config so Next.js 16 knows we're opting in/out intentionally.
  turbopack: {},
}

export default isPWAEnabled ? withPWA(nextConfig) : nextConfig
