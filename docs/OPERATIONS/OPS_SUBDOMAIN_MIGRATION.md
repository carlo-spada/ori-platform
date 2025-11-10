# Subdomain Routing Architecture

## Overview

The Ori Platform uses subdomain-based routing to separate the marketing site from the application:

- **Marketing Site**: `https://getori.app` - Public pages (landing, pricing, about, blog, features, legal)
- **Application**: `https://app.getori.app` - Authenticated app (dashboard, profile, applications, etc.)

## Current Implementation Status

✅ **Middleware routing implemented** - The application automatically routes based on subdomain
✅ **PWA configured** - Installed app opens directly to `app.getori.app`
✅ **Authentication updated** - Login/signup flows redirect to app subdomain
✅ **URL rewrites active** - Clean URLs on app subdomain (`/dashboard` instead of `/app/dashboard`)

## Architecture

### Marketing Site (getori.app)

**Public Pages:**

- `/` - Landing page
- `/about` - About us
- `/pricing` - Pricing plans
- `/blog` - Blog posts
- `/blog/[slug]` - Individual blog posts
- `/features` - Features overview
- `/legal/privacy-policy` - Privacy policy
- `/legal/terms-of-service` - Terms of service
- `/legal/cookie-policy` - Cookie policy

**Behavior:**

- Accessing `/login`, `/signup`, `/onboarding`, `/select-plan`, or `/app/*` on main domain redirects to app subdomain
- Marketing pages are not accessible on app subdomain (redirects to main domain)

### Application (app.getori.app)

**Authentication Pages:**

- `/login` - User login
- `/signup` - User registration
- `/select-plan` - Plan selection after signup
- `/onboarding` - User onboarding flow

**Authenticated Pages:**

- `/` - Dashboard (root redirects to dashboard)
- `/dashboard` - User dashboard
- `/profile` - User profile and settings
- `/applications` - Job applications tracking
- `/recommendations` - Job recommendations
- `/settings` - Account settings

**Behavior:**

- Root path `/` automatically shows dashboard
- Clean URLs (e.g., `/dashboard` instead of `/app/dashboard`)
- Marketing pages redirect to main domain
- PWA installs open to this subdomain

## How It Works

### Middleware Routing (`src/proxy.ts`)

The Next.js middleware handles all subdomain routing:

1. **Hostname Detection**: Checks if request is from `app.` subdomain
2. **Automatic Redirects**: Routes users to correct subdomain based on page type
3. **URL Rewrites**: Maps clean URLs to internal file structure
4. **Backward Compatibility**: Redirects old `/app/*` URLs to new structure

### URL Mapping

**On App Subdomain:**

```
User visits: app.getori.app/dashboard
Rewrites to: app.getori.app/app/dashboard (internal file path)
File served: src/app/app/dashboard/page.tsx
```

**On Main Domain:**

```
User visits: getori.app/login
Redirects to: app.getori.app/login
```

### File Structure

The file structure remains unchanged - subdomain routing is handled entirely by middleware:

```
src/app/
├── page.tsx                 # Landing page → getori.app
├── about/                   # Marketing → getori.app
├── pricing/                 # Marketing → getori.app
├── blog/                    # Marketing → getori.app
├── features/                # Marketing → getori.app
├── legal/                   # Marketing → getori.app
│   ├── privacy-policy/
│   ├── terms-of-service/
│   └── cookie-policy/
├── login/                   # Auth → app.getori.app (redirected by middleware)
├── signup/                  # Auth → app.getori.app (redirected by middleware)
├── onboarding/              # Onboarding → app.getori.app
├── select-plan/             # Plan selection → app.getori.app
└── app/                     # Authenticated routes → app.getori.app
    ├── dashboard/           # Served as /dashboard on app subdomain
    ├── profile/             # Served as /profile on app subdomain
    ├── applications/        # Served as /applications on app subdomain
    ├── recommendations/     # Served as /recommendations on app subdomain
    └── settings/            # Served as /settings on app subdomain
```

**Key Points:**

- No files need to be moved - middleware handles all routing
- Routes in `app/` folder are served with clean URLs on app subdomain
- Example: File at `src/app/app/dashboard/page.tsx` is accessible at `app.getori.app/dashboard`

## Deployment Setup

### Step 1: Configure Vercel Domains

Add both domains in Vercel project settings:

1. Go to Vercel project → **Settings** → **Domains**
2. Add `getori.app` (main domain)
3. Add `app.getori.app` (app subdomain)

### Step 2: Configure DNS

**Main Domain (`getori.app`):**

- Type: `A` or `CNAME`
- Target: Vercel's DNS target (provided in Vercel dashboard)

**App Subdomain (`app.getori.app`):**

- Type: `CNAME`
- Name: `app`
- Target: `cname.vercel-dns.com`

### Step 3: Update Supabase Configuration

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Update **Site URL**: `https://app.getori.app`
3. Add **Redirect URLs**:
   - `https://app.getori.app/**` (wildcard for all auth flows)
   - `https://app.getori.app/select-plan`
   - `https://app.getori.app/dashboard`
   - `https://app.getori.app/login`

### Step 4: Update Stripe Configuration

1. Go to Stripe Dashboard → Settings → Branding
2. Update **Business website**: `https://app.getori.app`
3. Go to Developers → Webhooks
4. Update webhook endpoint: `https://app.getori.app/api/v1/payments/webhook`

### Step 5: Environment Variables

No environment variables needed for subdomain routing (middleware handles it automatically).

Optional variables for external services:

```env
# Vercel (Production)
NEXT_PUBLIC_APP_URL=https://app.getori.app
FRONTEND_URL=https://app.getori.app
```

## Testing

### Local Development

To test subdomain routing locally:

1. **Add to `/etc/hosts`:**

   ```
   127.0.0.1 app.localhost
   127.0.0.1 localhost
   ```

2. **Start dev server:**

   ```bash
   pnpm dev
   ```

3. **Test URLs:**
   - `http://localhost:3000` - Marketing site
   - `http://app.localhost:3000` - App subdomain
   - `http://localhost:3000/login` - Redirects to app subdomain
   - `http://app.localhost:3000/` - Shows dashboard

### Production Testing

After deployment, verify:

- [ ] `https://getori.app` - Landing page loads
- [ ] `https://getori.app/pricing` - Pricing page loads
- [ ] `https://getori.app/login` - Redirects to `https://app.getori.app/login`
- [ ] `https://app.getori.app` - Shows dashboard (when logged in)
- [ ] `https://app.getori.app/dashboard` - Dashboard loads
- [ ] `https://app.getori.app/pricing` - Redirects to `https://getori.app/pricing`
- [ ] Login flow works correctly
- [ ] Signup flow works correctly
- [ ] Onboarding redirects to dashboard
- [ ] PWA install opens to app subdomain

## PWA Configuration

The PWA manifest is configured to open the app subdomain:

```json
{
  "start_url": "https://app.getori.app/",
  "scope": "https://app.getori.app/",
  "shortcuts": [
    { "url": "https://app.getori.app/dashboard" },
    { "url": "https://app.getori.app/applications" },
    { "url": "https://app.getori.app/profile" }
  ]
}
```

When users install the PWA on their device, it opens directly to `app.getori.app`.

## Migration Checklist

- [x] Middleware routing implemented
- [x] PWA manifest updated
- [x] Authentication redirects updated
- [x] URL rewrites configured
- [ ] Both domains configured in Vercel
- [ ] DNS records configured
- [ ] Supabase redirect URLs updated
- [ ] Stripe webhook endpoint updated
- [ ] SSL certificates verified
- [ ] Production testing completed

## Troubleshooting

### Redirect Loops

If you experience redirect loops:

1. Clear browser cache and cookies
2. Check that both domains are properly configured in Vercel
3. Verify middleware logic in `src/proxy.ts`

### PWA Not Opening to App Subdomain

1. Uninstall existing PWA
2. Clear browser cache
3. Reinstall PWA from `https://app.getori.app`

### Authentication Issues

1. Verify Supabase redirect URLs include `https://app.getori.app/**`
2. Check that `emailRedirectTo` in AuthProvider points to app subdomain
3. Clear browser cookies and retry

### 404 Errors on App Routes

1. Verify middleware is running (check `src/proxy.ts`)
2. Check that file structure in `src/app/app/*` is intact
3. Verify rewrite rules in middleware

## Rollback Plan

If issues occur:

1. **Remove app subdomain from Vercel:**
   - Vercel → Domains → Delete `app.getori.app`

2. **Revert middleware:**

   ```bash
   git revert <commit-hash>
   git push origin main
   ```

3. **Restore old URLs:**
   - Update Supabase redirect URLs back to old domain
   - Update Stripe webhook back to old domain

## Support Resources

- **Vercel Domains**: https://vercel.com/docs/projects/domains
- **Next.js Middleware**: https://nextjs.org/docs/app/building-your-application/routing/middleware
- **DNS Checker**: https://dnschecker.org
- **SSL Checker**: https://www.ssllabs.com/ssltest/
