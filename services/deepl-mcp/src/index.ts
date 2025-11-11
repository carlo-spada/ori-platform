
import express, { Request, Response } from 'express';
import * as deepl from 'deepl-node';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const PORT = process.env.PORT || 3002;

if (!DEEPL_API_KEY) {
  console.error('DEEPL_API_KEY environment variable is required');
  process.exit(1);
}

const translator = new deepl.Translator(DEEPL_API_KEY);

// MCP Manifest
app.get('/.well-known/mcp.json', (req: Request, res: Response) => {
  res.json({
    "mcp": "0.1",
    "name": "DeepL Translation",
    "description": "Translate text using DeepL API",
    "homepage": "https://www.deepl.com",
    "tools": {
      "translate": {
        "title": "Translate Text",
        "description": "Translate text to a target language",
        "http_handler": {
          "url": `${req.protocol}://${req.get('host')}/translate`,
          "method": "POST"
        },
        "parameters": [
          {
            "name": "text",
            "type": "string",
            "is_required": true,
            "description": "The text to translate"
          },
          {
            "name": "target_lang",
            "type": "string",
            "is_required": true,
            "description": "The target language code (e.g., 'DE', 'FR', 'ES')"
          }
        ],
        "response": {
          "content_type": "application/json",
          "schema": {
            "type": "object",
            "properties": {
              "translation": {
                "type": "string",
                "description": "The translated text"
              }
            }
          }
        }
      }
    }
  });
});

// Translate tool handler
app.post('/translate', async (req: Request, res: Response) => {
  const { text, target_lang } = req.body;

  if (!text || !target_lang) {
    return res.status(400).json({ error: 'Missing required parameters: text, target_lang' });
  }

  try {
    const result = await translator.translateText(text, null, target_lang as deepl.TargetLanguageCode);
    res.json({ translation: result.text });
  } catch (error) {
    console.error('DeepL API error:', error);
    res.status(500).json({ error: 'Failed to translate text' });
  }
});

app.listen(PORT, () => {
  console.log(`DeepL MCP server listening on port ${PORT}`);
});
