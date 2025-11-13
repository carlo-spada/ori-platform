"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deepl = __importStar(require("deepl-node"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const PORT = process.env.PORT || 3002;
if (!DEEPL_API_KEY) {
    console.error('DEEPL_API_KEY environment variable is required');
    process.exit(1);
}
const translator = new deepl.Translator(DEEPL_API_KEY);
// MCP Manifest
app.get('/.well-known/mcp.json', (req, res) => {
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
app.post('/translate', async (req, res) => {
    const { text, target_lang } = req.body;
    if (!text || !target_lang) {
        return res.status(400).json({ error: 'Missing required parameters: text, target_lang' });
    }
    try {
        const result = await translator.translateText(text, null, target_lang);
        const translatedText = Array.isArray(result) ? result[0].text : result.text;
        res.json({ translation: translatedText });
    }
    catch (error) {
        console.error('DeepL API error:', error);
        res.status(500).json({ error: 'Failed to translate text' });
    }
});
app.listen(PORT, () => {
    console.log(`DeepL MCP server listening on port ${PORT}`);
});
