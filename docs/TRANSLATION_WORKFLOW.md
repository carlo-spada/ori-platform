# Translation Workflow Documentation

## Overview

The Ori Platform uses an automated translation system powered by DeepL API to maintain translations across multiple languages. This document explains how to use and maintain the translation system.

## Supported Languages

- 🇬🇧 English (en) - Source language
- 🇩🇪 German (de)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇮🇹 Italian (it)

## Translation Structure

### File Organization

```
public/locales/
├── en/                     # English (source)
│   ├── translation.json    # Main UI translations
│   ├── legal-terms.json    # Terms of Service
│   ├── legal-privacy.json  # Privacy Policy
│   └── legal-cookies.json  # Cookie Policy
├── de/                     # German
├── es/                     # Spanish
├── fr/                     # French
└── it/                     # Italian
```

### Translation Namespaces

- `translation` - Main UI elements, buttons, labels, messages
- `legal-terms` - Terms of Service content
- `legal-privacy` - Privacy Policy content
- `legal-cookies` - Cookie Policy content

## Available Scripts

### 1. Sync Translations (Recommended)

**Purpose:** Synchronizes missing translations across all languages

```bash
# Sync all missing translations
DEEPL_API_KEY=your_key tsx scripts/sync-translations.ts
```

This script:
- Identifies missing translation keys
- Translates only what's missing
- Preserves existing translations
- Shows progress and usage statistics

### 2. Extract Translatable Content

**Purpose:** Find hardcoded strings that should be translated

```bash
# Scan codebase for hardcoded strings
tsx scripts/extract-translatable.ts

# Generate detailed report
tsx scripts/extract-translatable.ts --report

# Auto-add to translation files
tsx scripts/extract-translatable.ts --fix
```

This script:
- Scans all React components
- Identifies hardcoded text
- Suggests translation keys
- Can automatically add to translation files

### 3. Comprehensive Translation

**Purpose:** Full-featured translation with advanced options

```bash
# Translate everything
DEEPL_API_KEY=your_key tsx scripts/translate-all.ts

# Translate specific namespace
DEEPL_API_KEY=your_key tsx scripts/translate-all.ts --namespace=translation

# Translate to specific language
DEEPL_API_KEY=your_key tsx scripts/translate-all.ts --language=es

# Check translation status only
DEEPL_API_KEY=your_key tsx scripts/translate-all.ts --check-only

# Force retranslation (overwrites existing)
DEEPL_API_KEY=your_key tsx scripts/translate-all.ts --force
```

### 4. Legacy Scripts

- `translate-content.ts` - Translates legal documents from React components
- `translate-missing.ts` - Fills in missing translations

## GitHub Actions Automation

### Automatic Translation Workflow

The `.github/workflows/translate.yml` workflow automatically translates content when:

1. **On Push to main/dev branches** - When English translation files change
2. **Manual Trigger** - Via GitHub Actions UI with options:
   - Specific namespace
   - Specific language
   - All translations

### Setting up GitHub Secrets

Add your DeepL API key to GitHub Secrets:

1. Go to Settings → Secrets and variables → Actions
2. Add new repository secret: `DEEPL_API_KEY`
3. Paste your DeepL API key

## Development Workflow

### Adding New Translations

1. **Add to English source file:**

```json
// public/locales/en/translation.json
{
  "newFeature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}
```

2. **Use in React component:**

```tsx
import { useTranslation } from 'react-i18next'

function Component() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('newFeature.title')}</h1>
      <p>{t('newFeature.description')}</p>
    </div>
  )
}
```

3. **Sync translations:**

```bash
DEEPL_API_KEY=your_key tsx scripts/sync-translations.ts
```

### Adding New Language

1. **Update target languages in scripts:**

```typescript
// scripts/sync-translations.ts
const TARGET_LANGUAGES: deepl.TargetLanguageCode[] = [
  'de', 'es', 'fr', 'it',
  'pt-PT', // Add Portuguese
]
```

2. **Run sync script:**

```bash
DEEPL_API_KEY=your_key tsx scripts/sync-translations.ts
```

3. **Update i18n configuration if needed:**

```typescript
// src/i18n.ts
// Add language detection support
```

### Legal Document Updates

When updating legal documents:

1. **Edit the source component:**

```tsx
// src/app/legal/terms-of-service/page.tsx
const content = `
  <h1>Updated Terms</h1>
  <p>New content here...</p>
`
```

2. **Extract and translate:**

```bash
# Extract content from React components
DEEPL_API_KEY=your_key tsx scripts/translate-content.ts
```

## Best Practices

### 1. Translation Keys

Use hierarchical, descriptive keys:

```json
{
  "dashboard": {
    "header": {
      "title": "Dashboard",
      "subtitle": "Welcome back"
    },
    "stats": {
      "totalUsers": "Total Users",
      "activeNow": "Active Now"
    }
  }
}
```

### 2. Placeholders and Variables

Use interpolation for dynamic content:

```json
{
  "welcome": "Welcome, {{name}}!",
  "itemCount": "You have {{count}} item",
  "itemCount_plural": "You have {{count}} items"
}
```

```tsx
t('welcome', { name: user.name })
t('itemCount', { count: 5 })
```

### 3. Context-Specific Translations

Provide context for better translations:

```json
{
  "button": {
    "submit": "Submit",
    "submitForm": "Submit Form",
    "submitApplication": "Submit Application"
  }
}
```

### 4. HTML Content

Use HTML in translations when needed:

```json
{
  "terms": {
    "agree": "I agree to the <a>Terms of Service</a>"
  }
}
```

```tsx
<Trans i18nKey="terms.agree">
  I agree to the <Link to="/terms">Terms of Service</Link>
</Trans>
```

## Monitoring and Maintenance

### Check Translation Coverage

```bash
# Check for missing translations
DEEPL_API_KEY=your_key tsx scripts/translate-all.ts --check-only
```

### Extract Hardcoded Strings

```bash
# Find strings that should be translated
tsx scripts/extract-translatable.ts --report
```

### Monitor DeepL Usage

The scripts show API usage statistics:

```
📊 Usage: 229,163 / 500,000 (46%)
```

Monitor usage to avoid hitting limits.

## Troubleshooting

### Common Issues

1. **Rate Limiting**
   - Scripts include automatic delays
   - Wait and retry if rate limited

2. **Missing Environment Variable**
   ```bash
   export DEEPL_API_KEY=your_key
   ```

3. **File Not Found**
   - Ensure English source files exist
   - Run from project root

4. **Invalid API Key**
   - Check key at https://www.deepl.com/account
   - Ensure key has not expired

### Testing Translations

1. **Change language in browser:**

```tsx
// Programmatically
i18n.changeLanguage('de')

// Via UI language selector
```

2. **Check specific namespace:**

```tsx
const { t } = useTranslation('legal-terms')
```

## API Keys and Limits

### DeepL API Plans

#### Free Plan
- **Limit**: 500,000 characters/month
- **Key Format**: Ends with `:fx` (e.g., `xxxx-xxxx-xxxx:fx`)
- **Endpoint**: `https://api-free.deepl.com`
- **Best For**: Initial setup, small projects

#### Pro Plan
- **Limit**: Pay-per-use (shown as 1 trillion in API)
- **Key Format**: Standard UUID format (e.g., `xxxx-xxxx-xxxx`)
- **Endpoint**: `https://api.deepl.com`
- **Best For**: Production use, regular updates
- **Cost**: ~€20 per million characters after free tier

### API Key Detection

The scripts automatically detect your key type:
- Free keys (ending in `:fx`) → Use free endpoint
- Pro keys → Use pro endpoint

### Usage Monitoring

The scripts provide detailed usage information:
```
📊 Usage: 0 / 1,000,000,000,000 (0%)  # Pro Plan
📊 Usage: 250,000 / 500,000 (50%)      # Free Plan
```

**Warnings are shown when:**
- 75% of quota used → Yellow warning
- 90% of quota used → Red warning with character count remaining

### Error Notifications

The scripts include comprehensive error detection:

1. **API Key Issues**
   - Invalid or expired keys
   - Wrong endpoint for key type
   - Clear instructions for resolution

2. **Usage Limit Reached**
   - Monthly quota exceeded
   - Suggests upgrading or waiting

3. **Rate Limiting**
   - Automatic retry with delays
   - Progress indication

### Usage Optimization

- Sync script only translates missing keys
- Caches translations in JSON files
- Batch processing with delays
- Character count tracking per session

### Cost Estimation

**Monthly Usage Estimates:**
- Initial translation: ~200,000 characters (all content)
- Blog posts: ~25,000 characters per post × 4 languages = 100,000
- Updates: ~10,000 characters for UI changes

**Recommendation**: Free plan sufficient after initial setup, Pro plan for heavy content creation

## Contributing

When contributing translations:

1. Always edit English source files first
2. Run sync script to update other languages
3. Test translations in development
4. Commit all language files together
5. Include in PR: "Updated translations via DeepL"

## Support

For translation issues:
- Check this documentation
- Review script outputs for errors
- Verify API key and limits
- Contact maintainers if needed