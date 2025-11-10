# Translation Scripts

This directory contains automated translation scripts powered by DeepL API for maintaining multi-language support across the entire application.

## Setup

### 1. Get a DeepL API Key

DeepL offers a **free tier** with 500,000 characters per month, which is more than enough for our needs.

1. Go to [DeepL API Free Plan](https://www.deepl.com/pro-api)
2. Click "Sign up for free"
3. Create an account
4. Verify your email
5. Go to your [Account Settings](https://www.deepl.com/account/summary)
6. Copy your **Authentication Key**

### 2. Set Environment Variable

**Option A: Temporary (for one-time use)**

```bash
export DEEPL_API_KEY="your-key-here"
tsx scripts/translate-content.ts
```

**Option B: Add to `.env.local` (recommended)**

```bash
# Add to .env.local (this file is gitignored)
DEEPL_API_KEY=your-key-here
```

Then run:

```bash
source .env.local
tsx scripts/translate-content.ts
```

## Available Scripts

### 1. `sync-translations.ts` (Recommended)

Synchronizes missing translations across all languages. This is the main script you should use for regular translation updates.

```bash
DEEPL_API_KEY=your-key tsx scripts/sync-translations.ts
```

**Features:**

- Only translates missing keys (preserves existing translations)
- Shows progress and API usage
- Handles all namespaces automatically
- Efficient API usage with rate limiting protection

### 2. `extract-translatable.ts`

Scans the codebase to find hardcoded strings that should be translated.

```bash
# Scan and report
tsx scripts/extract-translatable.ts

# Generate detailed JSON report
tsx scripts/extract-translatable.ts --report

# Automatically add found strings to translation files
tsx scripts/extract-translatable.ts --fix
```

**Features:**

- Identifies JSX text, props, toast messages, and errors
- Suggests translation keys
- Generates migration guide
- Can auto-fix by adding to translation files

### 3. `translate-all.ts`

Comprehensive translation script with advanced options.

```bash
# Translate everything
DEEPL_API_KEY=your-key tsx scripts/translate-all.ts

# Translate specific namespace only
DEEPL_API_KEY=your-key tsx scripts/translate-all.ts --namespace=translation

# Translate to specific language only
DEEPL_API_KEY=your-key tsx scripts/translate-all.ts --language=es

# Check translation status without translating
DEEPL_API_KEY=your-key tsx scripts/translate-all.ts --check-only

# Force retranslation (overwrites existing)
DEEPL_API_KEY=your-key tsx scripts/translate-all.ts --force
```

### 4. `translate-content.ts`

Extracts and translates legal documents from React component files.

```bash
DEEPL_API_KEY=your-key tsx scripts/translate-content.ts
```

### 5. `translate-missing.ts`

Legacy script for filling in missing translations.

```bash
DEEPL_API_KEY=your-key tsx scripts/translate-missing.ts
```

## Usage

### What Gets Translated

The script automatically:

- ✅ Extracts content from React component files
- ✅ Preserves all HTML tags and formatting
- ✅ Keeps company name, email, and address unchanged
- ✅ Creates JSON files for each language
- ✅ Maintains legal terminology accuracy

### Output Structure

```
public/locales/
├── en/
│   ├── legal-terms.json
│   ├── legal-privacy.json
│   └── legal-cookies.json
├── de/
│   ├── legal-terms.json
│   ├── legal-privacy.json
│   └── legal-cookies.json
├── es/
│   └── ... (same files)
├── fr/
│   └── ... (same files)
└── it/
    └── ... (same files)
```

## DeepL Free Tier Limits

- **500,000 characters/month** (free)
- Our legal docs: ~50,000 characters per language
- 4 target languages = ~200,000 characters
- **Plenty of room left** for blog posts and other content!

## Cost Estimate

If you exceed the free tier:

- €4.99 + €20 per 1 million characters
- But 500k free tier should cover all our translation needs

## Supported Languages

Currently translating to:

- 🇩🇪 German (de)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇮🇹 Italian (it)

Source language: 🇬🇧 English (en)

## Features

### HTML Preservation

The script uses DeepL's `tagHandling: 'html'` option to preserve all HTML formatting:

```html
<p>Welcome to <strong>Ori</strong></p>
<!-- Translates to -->
<p>Willkommen bei <strong>Ori</strong></p>
```

### Protected Content

These are NOT translated:

- Company name: "Ori Technologies S.A. de C.V."
- Email: "support@carlospada.me"
- Address: "Via Antonio Fogazzaro, 5A, 35125 Padova PD, Italia"
- Brand names: Ori, Stripe, Google, GitHub, Apple ID
- Legal terms: GDPR

### Recursive Translation

The script recursively translates nested JSON objects, maintaining structure:

```json
{
  "title": "Terms of Service",
  "sections": {
    "intro": {
      "heading": "Introduction",
      "text": "Welcome to Ori..."
    }
  }
}
```

## Troubleshooting

### "DEEPL_API_KEY environment variable is required"

Make sure you've set the environment variable:

```bash
echo $DEEPL_API_KEY
# Should output your API key
```

### "Translation failed"

- Check your API key is valid
- Check you haven't exceeded your monthly limit
- Check your internet connection

### "Could not extract content"

- Make sure the legal document files exist
- Check the file format matches the expected structure

## Next Steps

After running the translation script:

1. **Update i18n configuration** to load legal namespaces
2. **Update legal page components** to use translations
3. **Test** all languages in the browser
4. **Add blog post translation** (coming soon)

## Resources

- [DeepL API Documentation](https://developers.deepl.com/docs)
- [DeepL Account Settings](https://www.deepl.com/account/summary)
- [Supported Languages](https://developers.deepl.com/docs/resources/supported-languages)
