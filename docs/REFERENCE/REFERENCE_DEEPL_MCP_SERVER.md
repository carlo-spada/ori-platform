---
type: reference-doc
role: documentation
scope: all
audience: developers
last-updated: 2025-11-10
relevance: reference, deepl, server.md, reference:, server, overview, purpose
priority: medium
quick-read-time: 3min
deep-dive-time: 4min
---

# Reference: DeepL MCP Server

**Status**: Active
**Owner**: Gemini
**Last Updated**: 2025-11-10

## 1. Overview

The DeepL MCP (Model Context Protocol) Server is a microservice within the Ori platform responsible for providing on-demand text translation capabilities. It exposes the DeepL translation API through an MCP-compliant interface, allowing AI agents and other services to perform translations programmatically.

This service is located in the `services/deepl-mcp` directory.

## 2. Purpose and Strategy

The primary purpose of the DeepL MCP Server is to enable **dynamic, real-time translation** use cases that are not covered by our static translation system.

It complements the existing `scripts/translate.ts` script by addressing a different need:

-   **`scripts/translate.ts` (Static Content):** This script is used for batch translation of static content that is part of the codebase, such as UI strings (locales) and legal documents. These translations are version-controlled and deployed with the application.

-   **DeepL MCP Server (Dynamic Content):** This service is designed for translating dynamic content, such as user-generated text, real-time chat messages, or content fetched from external sources. It provides a live endpoint that can be called by any service that needs a translation performed immediately.

This dual-system approach allows us to have a robust, version-controlled workflow for our application's core content, while also having the flexibility to handle dynamic translation needs in real time.

## 3. Architecture

The DeepL MCP Server is a simple Node.js application built with:

-   **Express.js:** For the HTTP server and routing.
-   **TypeScript:** For type safety and modern JavaScript features.
-   **`deepl-node`:** The official Node.js library for the DeepL API.

The server exposes two main endpoints as required by the MCP specification.

### MCP Endpoints

-   `GET /.well-known/mcp.json`: The MCP manifest. This endpoint provides metadata about the service and the tools it offers.
-   `POST /translate`: The handler for the translation tool. This endpoint receives the text and target language, calls the DeepL API, and returns the translation.

## 4. Configuration

The server is configured using environment variables. A `.env` file is used for local development.

| Variable        | Description                                  | Default |
| --------------- | -------------------------------------------- | ------- |
| `DEEPL_API_KEY` | Your API key for the DeepL service.          | (none)  |
| `PORT`          | The port on which the server will listen.    | `3002`  |

The `DEEPL_API_KEY` has been pre-configured in the `.env` file for this service.

## 5. Local Development

To run the server locally:

1.  Navigate to the service directory:
    ```bash
    cd services/deepl-mcp
    ```

2.  Install dependencies (if you haven't already):
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

The server will start on port 3002.

### Testing with cURL

You can test the `translate` endpoint using `curl`:

```bash
curl -X POST http://localhost:3002/translate \
-H "Content-Type: application/json" \
-d 
'{'
  "text": "This is a test.",
  "target_lang": "FR"
}'
```

**Expected Response:**

```json
{
  "translation": "Ceci est un test."
}
```

## 6. Docker Integration

A service definition for `deepl-mcp` is included but commented out in the root `docker-compose.yml` file. This is consistent with the project's convention of running services directly with `pnpm` during development.

To run the service in a Docker container, you can uncomment the `deepl-mcp` section in `docker-compose.yml` and run `docker-compose up`.

```