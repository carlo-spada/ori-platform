# DeepL MCP Server

This service provides a [Model Context Protocol (MCP)](https://developers.deepl.com/docs/learning-how-tos/examples-and-guides/deepl-mcp-server-how-to-build-and-use-translation-in-llm-applications) compliant server for interacting with the DeepL API. It allows AI agents and other services to perform translations.

## Endpoints

- `GET /.well-known/mcp.json`: The MCP manifest describing the available tools.
- `POST /translate`: The endpoint for the translation tool.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Create a `.env` file in this directory (`services/deepl-mcp`) and add your DeepL API key:
    ```
    DEEPL_API_KEY=your_deepl_api_key
    ```

## Usage

To start the server, run:

```bash
npm run dev
```

The server will start on port 3001 by default.

### Translation Tool

The `translate` tool accepts a JSON body with the following parameters:

- `text` (string, required): The text to translate.
- `target_lang` (string, required): The target language code (e.g., 'DE', 'FR', 'ES').

**Example Request:**

```bash
curl -X POST http://localhost:3001/translate \
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
