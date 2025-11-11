---
type: documentation
role: documentation
scope: all
audience: developers
last-updated: 2025-11-10
relevance: services, deepl, readme.md, server, endpoints, quick, start
priority: medium
quick-read-time: 1min
deep-dive-time: 2min
---

# DeepL MCP Server

This service provides a [Model Context Protocol (MCP)](https://developers.deepl.com/docs/learning-how-tos/examples-and-guides/deepl-mcp-server-how-to-build-and-use-translation-in-llm-applications) compliant server for interacting with the DeepL API. It allows AI agents and other services to perform translations.

For more detailed documentation, see `docs/REFERENCE/REFERENCE_DEEPL_MCP_SERVER.md`.

## Endpoints

- `GET /.well-known/mcp.json`: The MCP manifest describing the available tools.
- `POST /translate`: The endpoint for the translation tool.

## Quick Start

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the server:
    ```bash
    npm run dev
    ```

The server will start on port 3002 by default. The DeepL API key has already been configured in the `.env` file.

### Translation Tool

The `translate` tool accepts a JSON body with the following parameters:

- `text` (string, required): The text to translate.
- `target_lang` (string, required): The target language code (e.g., 'DE', 'FR', 'ES').

**Example Request:**

```bash
curl -X POST http://localhost:3002/translate \
-H "Content-Type: application/json" \
-d '{
  "text": "Hello, world!",
  "target_lang": "DE"
}'
```

**Example Response:**

```json
{
  "translation": "Hallo, Welt!"
}
```
