import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1')

  // Determine if this is the app subdomain
  const isAppSubdomain =
    hostname.startsWith('app.') || isLocalhost

  // Routes that belong to the authenticated app
  const appRoutes = [
    '/app/dashboard',
    '/app/profile',
    '/app/applications',
    '/app/recommendations',
    '/app/settings',
    '/onboarding',
    '/select-plan',
  ]

  // Routes that belong to the marketing site (main domain only)
  const marketingRoutes = [
    '/',
    '/about',
    '/pricing',
    '/blog',
    '/features',
    '/legal',
  ]

  // If accessing app subdomain
  if (isAppSubdomain) {
    // Redirect old /app/* routes to new root routes on app subdomain
    if (pathname.startsWith('/app/')) {
      const newPath = pathname.replace('/app', '')
      const url = request.nextUrl.clone()
      url.pathname = newPath || '/dashboard'
      return NextResponse.redirect(url)
    }

    // If trying to access marketing pages on app subdomain, redirect to main domain
    const isMarketingPage = marketingRoutes.some(
      (route) =>
        pathname === route ||
        (route !== '/' && pathname.startsWith(route + '/')),
    )

    if (isMarketingPage) {
      const url = request.nextUrl.clone()
      url.hostname = hostname.replace('app.', '')
      return NextResponse.redirect(url)
    }

    // Rewrite app subdomain root to dashboard
    if (pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/app/dashboard'
      return NextResponse.rewrite(url)
    }

    // Rewrite app routes to their /app/* equivalents
    if (
      pathname === '/dashboard' ||
      pathname === '/profile' ||
      pathname === '/applications' ||
      pathname === '/recommendations' ||
      pathname === '/settings'
    ) {
      const url = request.nextUrl.clone()
      url.pathname = `/app${pathname}`
      return NextResponse.rewrite(url)
    }
  } else {
    // On main domain (marketing site)
    // In production, redirect to app subdomain; in dev, allow access
    if (!isLocalhost) {
      // Redirect /app/* routes to app subdomain
      if (pathname.startsWith('/app/')) {
        const url = request.nextUrl.clone()
        url.hostname = `app.${hostname}`
        url.pathname = pathname.replace('/app', '')
        return NextResponse.redirect(url)
      }

      // Redirect auth pages, onboarding, and select-plan to app subdomain
      if (
        pathname === '/login' ||
        pathname === '/signup' ||
        pathname === '/onboarding' ||
        pathname === '/select-plan'
      ) {
        const url = request.nextUrl.clone()
        url.hostname = `app.${hostname}`
        return NextResponse.redirect(url)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
