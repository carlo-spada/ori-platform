# Translation Workflow Documentation

## Overview

The Ori Platform uses a unified, automated translation system powered by DeepL API. This document explains the simplified workflow for maintaining translations across all supported languages.

## 🎯 Quick Start

```bash
# Sync all missing translations (default behavior)
DEEPL_API_KEY=your_key tsx scripts/translate.ts

# Check what needs translation
DEEPL_API_KEY=your_key tsx scripts/translate.ts --check

# Force retranslate everything
DEEPL_API_KEY=your_key tsx scripts/translate.ts --force
```

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

## The Unified Translation Script

### `scripts/translate.ts` - One Script to Rule Them All

This consolidated script replaces all previous translation scripts and provides a single, consistent interface for all translation needs.

#### Basic Usage

```bash
# Default: Sync missing translations
DEEPL_API_KEY=your_key tsx scripts/translate.ts
```

#### Command Line Options

| Option | Description | Example |
|--------|-------------|---------|
| `--sync` | Translate only missing keys (default) | `--sync` |
| `--force` | Retranslate all keys, overwrite existing | `--force` |
| `--check` | Check for missing translations without changes | `--check` |
| `--namespace` | Target specific namespace(s) | `--namespace=legal-terms,translation` |
| `--language` | Target specific language(s) | `--language=de,es` |
| `--verbose` | Show detailed progress | `--verbose` |
| `--dry-run` | Preview changes without writing files | `--dry-run` |

#### Examples

```bash
# Check translation status
DEEPL_API_KEY=your_key tsx scripts/translate.ts --check

# Force retranslate legal documents
DEEPL_API_KEY=your_key tsx scripts/translate.ts --force --namespace=legal-terms,legal-privacy

# Translate only to German and Spanish
DEEPL_API_KEY=your_key tsx scripts/translate.ts --language=de,es

# Verbose mode with dry run
DEEPL_API_KEY=your_key tsx scripts/translate.ts --verbose --dry-run
```

#### Features

- ✅ **Smart Sync**: Only translates missing keys, preserving existing work
- 🚨 **Error Recovery**: Failed translations are logged to `.tmp/failed-translations.log`
- 📊 **Usage Tracking**: Shows API usage and warns when approaching limits
- 🎨 **Colored Output**: Clear, readable console output with progress indicators
- ⚡ **Rate Limiting**: Automatic retry with exponential backoff
- 🔑 **Multi-API Support**: Works with both Free and Pro DeepL keys

## Helper Scripts

### `extract-translatable.ts` - Find Hardcoded Strings

Scans your codebase to identify strings that should be translated.

```bash
# Find hardcoded strings
tsx scripts/extract-translatable.ts

# Generate detailed report
tsx scripts/extract-translatable.ts --report

# Auto-fix by adding to translation files
tsx scripts/extract-translatable.ts --fix
```

**Output:**
- Lists top hardcoded strings by frequency
- Suggests translation keys
- Can automatically add to `translation.json`
- Generates migration guide

## GitHub Actions Automation

### Automated Workflow Features

The `.github/workflows/translate.yml` workflow provides:

1. **Automatic Triggers**:
   - On push to `main` or `dev` when English files change
   - Weekly scheduled runs (Mondays at 9 AM UTC)
   - Manual trigger with custom options

2. **Pull Request Creation**:
   - Creates a new branch `chore/translation-updates-YYYY-MM-DD`
   - Opens a PR with detailed changes
   - Assigns reviewers automatically
   - Includes review checklist

3. **Manual Dispatch Options**:
   - `mode`: sync, force, or check
   - `namespace`: Specific namespaces to translate
   - `language`: Specific languages to target

### Setting Up GitHub Actions

1. **Add DeepL API Key**:
   ```
   Settings → Secrets → Actions → New repository secret
   Name: DEEPL_API_KEY
   Value: your-api-key-here
   ```

2. **Workflow Will**:
   - Run automatically on English content changes
   - Create PRs instead of direct commits
   - Include failed translations log if any errors occur

## Development Workflow

### Adding New Translations

1. **Add to English source**:
```json
// public/locales/en/translation.json
{
  "newFeature": {
    "title": "My New Feature",
    "description": "Feature description"
  }
}
```

2. **Use in React component**:
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

3. **Sync translations**:
```bash
DEEPL_API_KEY=your_key tsx scripts/translate.ts
```

### Legal Documents

Legal documents are now loaded directly from JSON translation files:

```tsx
// Components automatically load from translation files
<LegalDocument namespace="legal-terms" />
<LegalDocument namespace="legal-privacy" />
<LegalDocument namespace="legal-cookies" />
```

The content is managed entirely through the translation system, making updates seamless across all languages.

## API Keys and Limits

### DeepL API Plans

#### Free Plan
- **Limit**: 500,000 characters/month
- **Key Format**: Ends with `:fx` (e.g., `xxxx-xxxx-xxxx:fx`)
- **Best For**: Development, small projects

#### Pro Plan
- **Limit**: Pay-per-use (displays as 1 trillion)
- **Key Format**: Standard UUID (e.g., `xxxx-xxxx-xxxx`)
- **Best For**: Production, regular updates
- **Cost**: ~€20 per million characters

### Automatic Detection

The script automatically detects your key type:
```
🔌 Checking DeepL API...
Key type: PRO
✅ Connected to DeepL
📊 Usage: 380 / 1,000,000,000,000 (0%)
```

### Usage Warnings

- **75% used**: Yellow warning
- **90% used**: Red warning with remaining count
- **Limit reached**: Clear error with resolution steps

## Error Handling

### Failed Translations Log

Failed translations are logged to `.tmp/failed-translations.log`:
```
2025-01-15T10:30:00Z | translation | de | dashboard.title | Rate limit exceeded
```

### Error Notifications

The script provides clear, actionable error messages:

```
🚨🚨🚨 TRANSLATION API ERROR - ACTION REQUIRED! 🚨🚨🚨

❌ API Key Issue Detected
   • Key type: PRO
   • The API key may be expired or invalid

📝 To Fix:
   1. Check your DeepL account
   2. Verify the API key is active
   3. Update DEEPL_API_KEY environment variable
```

## Best Practices

### 1. Translation Keys

Use hierarchical, descriptive keys:
```json
{
  "dashboard": {
    "header": {
      "title": "Dashboard",
      "welcomeMessage": "Welcome back, {{name}}"
    }
  }
}
```

### 2. Regular Syncing

- Run `--check` regularly to monitor translation coverage
- Use GitHub Actions for automatic weekly syncs
- Review PRs before merging translation updates

### 3. Cost Management

**Monthly estimates**:
- Initial setup: ~200,000 characters
- Blog post (5000 words): ~25,000 characters × 4 languages = 100,000
- UI updates: ~10,000 characters

**Recommendation**: Free plan after initial setup, Pro for heavy content creation

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| API key error | Check key format (Free ends with `:fx`) |
| Rate limiting | Script auto-retries with delays |
| Missing translations | Run without `--check` flag |
| Failed translations | Check `.tmp/failed-translations.log` |

### Testing

```bash
# Test with check mode
DEEPL_API_KEY=your_key tsx scripts/translate.ts --check

# Test specific namespace
DEEPL_API_KEY=your_key tsx scripts/translate.ts --namespace=translation --dry-run

# View verbose output
DEEPL_API_KEY=your_key tsx scripts/translate.ts --verbose
```

## Migration from Old System

If you're migrating from the old multi-script system:

1. **Old scripts moved to**: `scripts/deprecated/`
2. **New unified script**: `scripts/translate.ts`
3. **GitHub Actions**: Updated to use new script and create PRs
4. **Legal components**: Now use `LegalDocument` component

### What Changed

- ✅ **One script instead of five**
- ✅ **Consistent error handling**
- ✅ **Failed translations log**
- ✅ **PR creation instead of direct commits**
- ✅ **Legal docs from JSON files**
- ✅ **Better progress tracking**

## Support

For translation issues:
1. Check this documentation
2. Review `.tmp/failed-translations.log`
3. Verify API key and limits
4. Run with `--verbose` for detailed output
5. Contact maintainers if needed

---

*Last updated: November 2024*
*Unified translation system v2.0*