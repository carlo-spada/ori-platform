# Model Context Protocol (MCP) - Complete Reference

## What is MCP?

The Model Context Protocol (MCP) is a universal standard for model-to-world interactions, enabling LLMs and agents to seamlessly connect with and utilize external data sources and tools. It provides a standardized way for AI models to access contextual information and execute actions beyond their training data.

---

## Core Architecture

### Client-Server Model

```
┌─────────────┐         ┌─────────────┐
│             │         │             │
│  AI Client  │ ←─MCP─→ │ MCP Server  │
│  (Claude)   │         │  (Tools)    │
│             │         │             │
└─────────────┘         └─────────────┘
```

- **Clients**: AI applications (Claude Desktop, VS Code, custom tools) that initiate connections
- **Servers**: Provide resources, tools, and prompts through standard interfaces
- **Transport**: STDIO (local), SSE, HTTP (remote) for bidirectional communication

---

## MCP Capabilities

### 1. Tools (Executable Functions)

Tools are functions that models invoke to perform actions.

**Characteristics**:
- Require explicit invocation
- Can modify external state
- Must include clear descriptions and input schemas
- Subject to permission controls

**Examples**:
- Web searches
- File operations
- Database queries
- API calls
- Email sending

**Usage Pattern**:
```typescript
// Tool invocation
mcp__postgres__query({ sql: 'SELECT * FROM users;' })
mcp__MCP_DOCKER__send_email({
  to: 'user@example.com',
  subject: 'Welcome',
  html: '<p>Content</p>'
})
```

### 2. Resources (Contextual Data)

Resources provide static information without requiring computation.

**Characteristics**:
- Read-only data sources
- Provide context for model decisions
- No side effects
- Can be files, database contents, documents

**Examples**:
- File contents
- Database records
- API documentation
- Configuration data

**Usage Pattern**:
```typescript
// Resource reading
ReadMcpResourceTool({
  server: 'filesystem',
  uri: 'file:///path/to/document.md'
})
```

### 3. Prompts (Predefined Templates)

Instruction sets that guide model behavior.

**Characteristics**:
- Can be parameterized
- Establish consistent interaction patterns
- Define workflows and behaviors

**Examples**:
- Code review templates
- Documentation generation guides
- Testing strategies

### 4. Additional Features

- **Discovery**: Dynamic capability detection at runtime
- **Sampling**: Model-specific response generation control
- **Roots**: Workspace context definition
- **Elicitation**: Guided information-gathering
- **Instructions**: System-level guidance

---

## Best Practices

### For AI Usage

1. **Tool Selection**
   - ALWAYS prefer MCP tools over bash commands
   - Use `mcp__postgres__query` for database reads
   - Use `mcp__filesystem__*` for file operations
   - Use `mcp__MCP_DOCKER__*` for external services

2. **Discovery First**
   - Check available capabilities before attempting operations
   - Use `ListMcpResourcesTool` to see what's available
   - Verify server status before complex operations

3. **Error Handling**
   - Gracefully handle unavailable servers
   - Provide fallback strategies
   - Log errors for debugging

4. **Security**
   - Never expose credentials in tool calls
   - Use environment variables for secrets
   - Validate inputs before tool invocation

### For Development

1. **Server Configuration**
   - Define servers in `claude_desktop_config.json`
   - Use environment variables for credentials
   - Configure only necessary servers (minimize latency)

2. **Tool Design**
   - Provide clear descriptions
   - Define comprehensive input/output schemas
   - Implement robust error handling
   - Support graceful degradation

3. **Documentation**
   - Document all available tools
   - Provide usage examples
   - Specify prerequisites and setup steps

---

## Security Considerations

### Critical Rules

1. **Credential Management**
   - Use environment variables (NOT hardcoded)
   - Implement OAuth 2.1 for remote servers
   - Rotate keys regularly

2. **Access Control**
   - Restrict tools through allowlists
   - Implement permission checks
   - Monitor server logs

3. **Transport Security**
   - Use HTTPS/TLS for remote connections
   - Validate certificates
   - Encrypt sensitive data

4. **Input Validation**
   - Validate all tool inputs server-side
   - Sanitize user-provided data
   - Prevent injection attacks

---

## Available MCP Servers in This Project

### ✅ Active Servers

#### 1. Filesystem MCP
**Status**: Active
**Tools**: `read_text_file`, `write_file`, `edit_file`, `list_directory`, `search_files`, etc.
**Scope**: `/Users/carlo/Desktop/Projects/ori-platform`
**Use for**: All file operations (NEVER use bash `cat`, `grep`, `find`)

```typescript
// Read file
mcp__filesystem__read_text_file({ path: '/path/to/file.ts' })

// Write file
mcp__filesystem__write_file({
  path: '/path/to/file.ts',
  content: 'export const foo = "bar";'
})

// Edit file
mcp__filesystem__edit_file({
  path: '/path/to/file.ts',
  edits: [{ oldText: 'bar', newText: 'baz' }]
})
```

#### 2. Postgres MCP
**Status**: Configured
**Tool**: `query`
**Use for**: Read-only SQL queries

```typescript
mcp__postgres__query({
  sql: 'SELECT * FROM auth.users LIMIT 5;'
})
```

#### 3. MCP Docker (Multiple Services)

##### Resend Email
```typescript
mcp__MCP_DOCKER__send_email({
  from: 'noreply@getori.app',
  to: 'user@example.com',
  subject: 'Welcome to Ori',
  html: '<p>Email content</p>'
})
```

##### Stripe
```typescript
// List customers
mcp__MCP_DOCKER__list_customers()

// Search resources
mcp__MCP_DOCKER__search_stripe_resources({
  query: 'subscription status:active'
})

// Create customer
mcp__MCP_DOCKER__create_customer({
  email: 'user@example.com',
  name: 'John Doe'
})
```

##### Web Fetch
```typescript
mcp__MCP_DOCKER__fetch({
  url: 'https://api.example.com/data',
  max_length: 5000
})
```

##### Context7 (Library Docs)
```typescript
// ALWAYS resolve ID first!
mcp__MCP_DOCKER__resolve_library_id({
  libraryName: 'next.js'
})

// Then fetch docs
mcp__MCP_DOCKER__get_library_docs({
  context7CompatibleLibraryID: '/vercel/next.js',
  topic: 'app router'
})
```

#### 4. DeepL MCP Server
**Status**: Active
**Tools**: `translate`
**Use for**: On-demand translation of dynamic text.
**Reference**: [DeepL MCP Server Documentation](./REFERENCE/REFERENCE_DEEPL_MCP_SERVER.md)

```typescript
// This is a conceptual example of how an agent would call the tool.
// The actual implementation is a POST request to the /translate endpoint.
deepl_mcp__translate({
  text: 'Hello, world!',
  target_lang: 'DE'
})
```

#### 5. Notion MCP
**Status**: Configured (needs token)
**Tools**: `search`, `retrieve_page`, `create_page`, `update_page`, `query_database`, `append_blocks`, `create_comment`
**Use for**: Documentation sync, knowledge base management

```typescript
// Search workspace
mcp__notion__search({ query: 'authentication' })

// Create page
mcp__notion__create_page({
  parent: { page_id: 'parent-page-id' },
  properties: { title: [{ text: { content: 'New Page' } }] },
  children: [/* blocks */]
})
```

#### 5. Playwright MCP
**Status**: Active
**Use for**: Browser automation, visual testing, screenshots

```typescript
// Navigate and capture
playwright_navigate({ url: 'http://localhost:3000' })
playwright_screenshot({ path: './screenshot.png' })
```

### ⚠️ Servers Needing Configuration

- **GitHub MCP**: Needs `GITHUB_PERSONAL_ACCESS_TOKEN`
- **Notion MCP**: Needs Notion integration token

---

## MCP vs Traditional Tools

| Operation | ❌ Don't Use | ✅ Use Instead |
|-----------|-------------|----------------|
| Read file | `cat file.ts` | `mcp__filesystem__read_text_file` |
| Search code | `grep "pattern"` | `Grep` tool or `mcp__filesystem__search_files` |
| Find files | `find . -name "*.ts"` | `Glob` tool |
| Database query | `psql -c "SELECT..."` | `mcp__postgres__query` |
| Web request | `curl https://...` | `mcp__MCP_DOCKER__fetch` |
| Stripe operation | Manual API call | `mcp__MCP_DOCKER__*` Stripe tools |

---

## Quick Decision Tree

```
Need to interact with external system?
│
├─ File operation?
│  └─ Use mcp__filesystem__* tools
│
├─ Database query?
│  └─ Use mcp__postgres__query
│
├─ Stripe operation?
│  └─ Use mcp__MCP_DOCKER__* Stripe tools
│
├─ Send email?
│  └─ Use mcp__MCP_DOCKER__send_email
│
├─ Get library docs?
│  └─ Use mcp__MCP_DOCKER__resolve_library_id + get_library_docs
│
├─ Web content fetch?
│  └─ Use mcp__MCP_DOCKER__fetch
│
├─ Notion operation?
│  └─ Use mcp__notion__* tools
│
└─ Browser automation?
   └─ Use Playwright MCP
```

---

## Common Patterns

### Pattern 1: Database → File Sync

```typescript
// 1. Query database
const result = await mcp__postgres__query({
  sql: 'SELECT * FROM features;'
})

// 2. Write to file
await mcp__filesystem__write_file({
  path: '/docs/features.json',
  content: JSON.stringify(result, null, 2)
})
```

### Pattern 2: Documentation → Notion

```typescript
// 1. Read local docs
const content = await mcp__filesystem__read_text_file({
  path: '/docs/OAUTH_SETUP_GUIDE.md'
})

// 2. Create Notion page
await mcp__notion__create_page({
  parent: { database_id: 'docs-db-id' },
  properties: {
    Name: { title: [{ text: { content: 'OAuth Setup' } }] }
  },
  children: convertMarkdownToNotionBlocks(content)
})
```

### Pattern 3: Library Docs → Development

```typescript
// 1. Resolve library
const lib = await mcp__MCP_DOCKER__resolve_library_id({
  libraryName: 'react-query'
})

// 2. Get specific topic
const docs = await mcp__MCP_DOCKER__get_library_docs({
  context7CompatibleLibraryID: lib.id,
  topic: 'mutations'
})

// 3. Use docs to implement feature
// ... implementation using latest docs
```

---

## Troubleshooting

### Server Not Available

**Symptom**: Tool calls fail with "server not found"

**Solutions**:
1. Check `claude_desktop_config.json` configuration
2. Restart Claude Desktop
3. Verify environment variables are set
4. Check server logs for errors

### Permission Denied

**Symptom**: Tool calls succeed but return permission errors

**Solutions**:
1. Verify allowed directories in config
2. Check file permissions
3. Ensure tokens/keys have correct scopes

### Tool Not Found

**Symptom**: Specific tool not available

**Solutions**:
1. Use `ListMcpResourcesTool` to see available tools
2. Verify server is running (for Docker-based servers)
3. Check tool name spelling (prefix with `mcp__server__`)

---

## References

- **Official Site**: https://modelcontextprotocol.io
- **Full Spec**: https://modelcontextprotocol.io/llms-full.txt
- **GitHub**: https://github.com/modelcontextprotocol
- **SDKs**: Python, TypeScript (official)

---

## Project-Specific Notes

### Configuration Location
`~/Library/Application Support/Claude/claude_desktop_config.json`

### Active Servers
See `CLAUDE.md` section "MCP Tools Available" for complete list with setup status

### Setup Scripts
- MCP Docker: `./scripts/setup-mcp-servers.sh`
- Notion: See `docs/NOTION_MCP_SETUP.md`

### Integration Points
- Database: Supabase via Postgres MCP
- Payments: Stripe via MCP Docker
- Email: Resend via MCP Docker
- Docs: Notion MCP for knowledge management
- Testing: Playwright MCP for visual testing

---

**Last Updated**: 2025-11-10
**Version**: 1.0
