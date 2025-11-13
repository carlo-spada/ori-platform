---
type: setup-guide
role: configuration-guide
scope: backend, authentication
audience: backend-developers, claude, ops
last-updated: 2025-11-11
relevance: oauth, authentication, google, apple, supabase, setup
priority: high
quick-read-time: 5min
deep-dive-time: 20min
---

# OAuth Setup Guide: Google & Apple Sign In

**⚠️ IMPORTANT: Always read [DOC_INDEX.md](../DOC_INDEX.md) first for current project status and navigation.**

This guide will help you configure Google and Apple OAuth providers in Supabase for your Ori platform.

## Prerequisites

- Supabase project: `zvngsecxzcgxafbzjewh`
- Access to Supabase dashboard: https://supabase.com/dashboard/project/zvngsecxzcgxafbzjewh
- Google Cloud Console account
- Apple Developer account

## Overview

The OAuth implementation is complete and includes:
- ✅ Auth provider context with OAuth methods
- ✅ Social auth buttons component
- ✅ OAuth callback route handler
- ✅ Updated login and signup pages
- ⚠️ **Needs configuration**: OAuth providers in Supabase

## Configuration Required

### Redirect URLs

Add these redirect URLs to your OAuth provider configs:

**Development:**
- `http://localhost:3000/auth/callback`

**Production:**
- `https://app.getori.app/auth/callback`
- `https://getori.app/auth/callback`

---

## 1. Configure Google OAuth

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing: "Ori Platform"
3. Enable Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click **Enable**

4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Application type: **Web application**
   - Name: "Ori Web App"

5. Configure Authorized redirect URIs:
   ```
   https://zvngsecxzcgxafbzjewh.supabase.co/auth/v1/callback
   ```

6. Click **Create**
7. Copy the **Client ID** and **Client Secret**

### Step 2: Configure in Supabase

1. Go to [Supabase Authentication Settings](https://supabase.com/dashboard/project/zvngsecxzcgxafbzjewh/auth/providers)
2. Click on **Google** provider
3. Enable the provider
4. Paste the **Client ID** and **Client Secret** from Google
5. Configure **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://app.getori.app`

6. Add **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://app.getori.app/auth/callback
   https://getori.app/auth/callback
   ```

7. Click **Save**

### Step 3: Test Google Sign In

1. Go to `http://localhost:3000/login`
2. Click "Sign in with Google"
3. You should be redirected to Google's OAuth consent screen
4. After authorizing, you'll be redirected back to `/dashboard`

---

## 2. Configure Apple OAuth

### Step 1: Create Apple Services ID

1. Go to [Apple Developer](https://developer.apple.com/account/resources/identifiers/list/serviceId)
2. Click **+** to create a new identifier
3. Select **Services IDs** → Continue
4. Configure Service ID:
   - Description: "Ori Platform"
   - Identifier: `app.getori.signin` (or your domain)
   - Enable "Sign in with Apple"
   - Click **Configure**

5. Configure domains and redirect URLs:
   - **Domains and Subdomains**: `zvngsecxzcgxafbzjewh.supabase.co`
   - **Return URLs**: `https://zvngsecxzcgxafbzjewh.supabase.co/auth/v1/callback`
   - Click **Next** → **Done** → **Continue** → **Register**

### Step 2: Create Apple Key

1. Go to [Apple Keys](https://developer.apple.com/account/resources/authkeys/list)
2. Click **+** to create a new key
3. Configure:
   - **Key Name**: "Ori Sign in with Apple"
   - Enable **Sign in with Apple**
   - Click **Configure** → Select your Services ID → **Save**
   - Click **Continue** → **Register**

4. **Download the key file** (.p8)
   - ⚠️ **Important**: You can only download this once!
   - Save it securely as `AuthKey_XXXXXXXXXX.p8`
   - Note the **Key ID** (e.g., `ABCDEF1234`)

### Step 3: Get Team ID

1. Go to [Apple Membership](https://developer.apple.com/account/#/membership/)
2. Copy your **Team ID** (e.g., `A1B2C3D4E5`)

### Step 4: Configure in Supabase

1. Go to [Supabase Authentication Settings](https://supabase.com/dashboard/project/zvngsecxzcgxafbzjewh/auth/providers)
2. Click on **Apple** provider
3. Enable the provider
4. Fill in the details:
   - **Services ID**: `app.getori.signin` (from Step 1)
   - **Team ID**: Your Apple Team ID (from Step 3)
   - **Key ID**: Your Key ID (from Step 2)
   - **Secret Key**: Paste the contents of your `.p8` file

5. Configure **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://app.getori.app`

6. Add **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://app.getori.app/auth/callback
   https://getori.app/auth/callback
   ```

7. Click **Save**

### Step 5: Test Apple Sign In

1. Go to `http://localhost:3000/login`
2. Click "Sign in with Apple"
3. You should be redirected to Apple's OAuth consent screen
4. After authorizing, you'll be redirected back to `/dashboard`

---

## 3. Additional Configuration

### Update Site URL in Supabase

Make sure the Site URL is correctly configured in Supabase:

1. Go to [Auth Settings](https://supabase.com/dashboard/project/zvngsecxzcgxafbzjewh/auth/url-configuration)
2. Set **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://app.getori.app`

### Add Redirect URLs

Ensure all redirect URLs are added:

```
http://localhost:3000/auth/callback
https://app.getori.app/auth/callback
https://getori.app/auth/callback
```

### Configure Email Templates

After users sign in with OAuth, they might need email verification:

1. Go to [Email Templates](https://supabase.com/dashboard/project/zvngsecxzcgxafbzjewh/auth/templates)
2. Customize the email templates with Ori branding
3. Update the redirect URLs in email templates to use `https://app.getori.app`

---

## 4. Testing Checklist

### Local Development

- [ ] Google Sign In works on `localhost:3000/login`
- [ ] Apple Sign In works on `localhost:3000/login`
- [ ] Google Sign Up works on `localhost:3000/signup`
- [ ] Apple Sign Up works on `localhost:3000/signup`
- [ ] OAuth callback redirects to `/dashboard` correctly
- [ ] User session persists after OAuth login
- [ ] User profile is created in database

### Production

- [ ] Google Sign In works on `app.getori.app/login`
- [ ] Apple Sign In works on `app.getori.app/login`
- [ ] OAuth callback redirects work on production
- [ ] SSL/HTTPS working correctly
- [ ] Email notifications work after OAuth signup

---

## 5. Troubleshooting

### Common Issues

#### "Error: Invalid redirect URL"

**Solution**: Make sure the redirect URL in your OAuth provider (Google/Apple) exactly matches the Supabase callback URL:
```
https://zvngsecxzcgxafbzjewh.supabase.co/auth/v1/callback
```

#### "Error: OAuth provider not configured"

**Solution**: Check that:
1. Provider is enabled in Supabase
2. Client ID/Secret are correctly entered
3. No extra spaces or newlines in credentials

#### "Error: Unauthorized client"

**Solution**: For Google:
- Verify the Client ID matches exactly
- Check that redirect URI is authorized in Google Cloud Console
- Make sure Google+ API is enabled

For Apple:
- Verify Services ID is correct
- Check that the `.p8` key content is complete
- Ensure Team ID and Key ID are correct

#### OAuth callback gets stuck

**Solution**:
1. Clear browser cookies and try again
2. Check browser console for errors
3. Verify the callback route exists at `/auth/callback`
4. Check Supabase logs for authentication errors

#### User data not saved after OAuth

**Solution**:
1. Check that RLS policies allow insert for authenticated users
2. Verify the `user_profiles` table trigger is working
3. Check Supabase database logs

---

## 6. Security Considerations

### Best Practices

1. **Never commit OAuth credentials** to git
2. Use environment variables for sensitive data
3. Regularly rotate OAuth secrets
4. Monitor OAuth usage in provider dashboards
5. Implement rate limiting on auth endpoints
6. Log and monitor failed authentication attempts

### Production Checklist

- [ ] OAuth secrets stored in environment variables
- [ ] HTTPS enforced on all OAuth callbacks
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] Monitoring and alerting set up
- [ ] Backup authentication methods available

---

## 7. Code Implementation Details

### Auth Provider Methods

The following OAuth methods are available in `AuthProvider`:

```typescript
const { signInWithGoogle, signInWithApple } = useAuth()

// Sign in with Google
await signInWithGoogle()

// Sign in with Apple
await signInWithApple()
```

### OAuth Flow

1. User clicks "Sign in with Google/Apple"
2. Redirects to OAuth provider's consent screen
3. User authorizes the application
4. Provider redirects to Supabase callback with auth code
5. Supabase exchanges code for session
6. Redirects to `/auth/callback` in your app
7. Callback route processes the session
8. User redirected to `/dashboard`

### Customization

To customize the OAuth buttons, edit:
- `/src/components/auth/SocialAuthButtons.tsx`

To change redirect behavior, edit:
- `/src/app/auth/callback/route.ts`

---

## 8. Next Steps

After configuring OAuth:

1. **Test thoroughly** in both development and production
2. **Monitor authentication logs** in Supabase dashboard
3. **Set up analytics** to track OAuth vs email signups
4. **Consider adding more providers** (GitHub, Microsoft, etc.)
5. **Implement account linking** for users with multiple auth methods

---

## Support

If you encounter issues:

1. Check Supabase logs: [Database Logs](https://supabase.com/dashboard/project/zvngsecxzcgxafbzjewh/logs/auth-logs)
2. Review Google OAuth logs: [Google Cloud Console](https://console.cloud.google.com/)
3. Check Apple Developer logs: [Apple Developer Portal](https://developer.apple.com/)

For Supabase-specific OAuth issues, see:
- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
