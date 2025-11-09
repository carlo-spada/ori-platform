# Subdomain Migration Guide: app.getori.app

This guide explains how to migrate the Ori Platform application to use the `app.getori.app` subdomain.

## Overview

The application will be accessible at:
- **Production**: `https://app.getori.app`
- **Current**: `https://ori-platform.vercel.app` (or custom domain if configured)

## Prerequisites

1. You own the domain `getori.app`
2. Access to DNS management for `getori.app`
3. Access to Vercel project settings
4. The `main` branch is deployed to production

## Step 1: Configure Vercel Domain

### 1.1 Add Domain in Vercel

1. Go to your Vercel project: https://vercel.com/[your-team]/ori-platform
2. Navigate to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter: `app.getori.app`
5. Click **Add**

### 1.2 Note the DNS Records

Vercel will provide DNS records to configure. You'll see one of:
- **A Record**: Points to Vercel's IP address
- **CNAME Record**: Points to `cname.vercel-dns.com`

**Recommended**: Use CNAME if possible, as it's more flexible.

## Step 2: Configure DNS

### Option A: Using Cloudflare (Recommended)

1. Log into Cloudflare
2. Select the `getori.app` domain
3. Navigate to **DNS** → **Records**
4. Click **Add record**
5. Configure:
   - **Type**: `CNAME`
   - **Name**: `app`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: DNS only (gray cloud) initially
   - **TTL**: Auto
6. Click **Save**

**Note**: After Vercel verifies the domain, you can enable Cloudflare proxy (orange cloud) for additional security and CDN benefits.

### Option B: Using Other DNS Providers

1. Log into your DNS provider
2. Navigate to DNS management for `getori.app`
3. Add a new record:
   - **Type**: `CNAME`
   - **Host/Name**: `app`
   - **Value/Target**: `cname.vercel-dns.com`
   - **TTL**: 3600 (or default)
4. Save the record

## Step 3: Verify Domain in Vercel

1. Return to Vercel project → **Settings** → **Domains**
2. Wait for DNS propagation (can take 5-60 minutes)
3. Vercel will automatically verify the domain
4. Once verified, you'll see a green checkmark next to `app.getori.app`

## Step 4: Set as Primary Domain (Optional)

If you want `app.getori.app` to be the canonical URL:

1. In Vercel Domains settings
2. Find `app.getori.app`
3. Click the three dots **⋮** → **Set as Primary**
4. This redirects all other domains to `app.getori.app`

## Step 5: Update Application Configuration

### 5.1 Environment Variables

Update the following environment variables in Vercel:

**Production Environment:**
```env
NEXT_PUBLIC_APP_URL=https://app.getori.app
NEXT_PUBLIC_API_URL=https://app.getori.app/api
```

**For Supabase Redirect URLs:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add to **Redirect URLs**:
   - `https://app.getori.app/auth/callback`
   - `https://app.getori.app/**` (wildcard for all auth flows)

**For Stripe:**
1. Go to Stripe Dashboard → Settings → Branding
2. Update **Business website** to: `https://app.getori.app`
3. Go to Developers → Webhooks
4. Update webhook endpoint to: `https://app.getori.app/api/v1/payments/webhook`

### 5.2 Update Next.js Metadata (Optional)

If you want to add the canonical URL to metadata, update `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Ori Platform',
  description: '...',
  metadataBase: new URL('https://app.getori.app'),
  // ... rest of metadata
}
```

## Step 6: Test the Migration

1. **DNS Propagation Check**:
   ```bash
   nslookup app.getori.app
   # Should return Vercel's IP or CNAME
   ```

2. **SSL Certificate**:
   - Visit `https://app.getori.app`
   - Check for valid SSL certificate (Vercel auto-provisions)

3. **Functionality Tests**:
   - [ ] Homepage loads correctly
   - [ ] Login/signup works
   - [ ] Authentication redirects properly
   - [ ] API calls resolve correctly
   - [ ] PWA install prompt appears
   - [ ] Stripe payment flows work

4. **PWA Verification**:
   - Open DevTools → Application → Manifest
   - Verify manifest loads from correct URL
   - Test "Add to Home Screen" on mobile

## Step 7: Update Documentation

Update the following files to reference the new domain:

- [ ] `README.md` - Update demo/deployment URLs
- [ ] `CLAUDE.md` - Update any hardcoded URLs
- [ ] `.env.example` - Update example URLs
- [ ] Any marketing materials or external links

## Rollback Plan

If issues occur:

1. **Remove Domain Assignment**:
   - In Vercel → Domains, delete `app.getori.app`

2. **Revert Environment Variables**:
   - Restore previous `NEXT_PUBLIC_APP_URL` values

3. **Revert External Services**:
   - Update Supabase redirect URLs back to previous domain
   - Update Stripe webhook endpoint back to previous domain

## DNS Propagation Troubleshooting

**Slow propagation?**
- Use `dig app.getori.app` to check current DNS resolution
- Clear browser cache: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Try incognito/private browsing mode
- Check https://www.whatsmydns.net/#CNAME/app.getori.app

**Vercel not detecting domain?**
- Ensure DNS record is exactly `cname.vercel-dns.com` (no trailing dot)
- Wait at least 5-10 minutes after DNS changes
- Click "Refresh" in Vercel domain settings

**SSL certificate issues?**
- Vercel auto-provisions SSL via Let's Encrypt
- This happens automatically after domain verification
- Can take 1-5 minutes after verification

## Post-Migration Checklist

- [ ] DNS record created and propagated
- [ ] Domain verified in Vercel
- [ ] SSL certificate active
- [ ] Environment variables updated
- [ ] Supabase redirect URLs updated
- [ ] Stripe webhooks updated
- [ ] Authentication flows tested
- [ ] PWA install tested on mobile
- [ ] Documentation updated
- [ ] Old domain redirects configured (if needed)

## Additional Notes

### Marketing Domain vs App Domain

Consider this architecture:
- **Marketing/Landing**: `https://getori.app` (main website)
- **Application**: `https://app.getori.app` (logged-in experience)
- **API**: `https://api.getori.app` (optional, if separating API)

This separation allows:
- Different deployment configurations
- Separate analytics/tracking
- Clearer user mental model
- Better SEO for marketing content

### Future Considerations

**Preview Deployments**:
- Vercel automatically creates preview URLs for PRs
- Format: `ori-platform-git-[branch]-[team].vercel.app`
- These remain accessible even with custom domain

**Staging Environment**:
- Consider: `staging.app.getori.app` for testing
- Requires separate Vercel project or branch-based deployment

**API Subdomain**:
- If API grows large, consider: `api.getori.app`
- Currently API is served from Next.js app routes
- This would require architectural changes

## Support

- **Vercel Docs**: https://vercel.com/docs/projects/domains
- **DNS Checker**: https://dnschecker.org
- **SSL Checker**: https://www.ssllabs.com/ssltest/
