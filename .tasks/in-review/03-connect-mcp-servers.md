# Connect MCP Servers for Development Velocity

**Status**: TODO
**Priority**: HIGH
**Estimated**: 3 hours
**Owner**: Claude

## Objective

Connect Claude CLI to Model Context Protocol (MCP) servers for 5x productivity boost on all future development work.

## Why This Matters

**Current**: Manual API calls, documentation lookup, slow iteration
**After MCP**: Direct service integration, instant operations, automated workflows

**Productivity Impact**: 3-5x faster for every feature going forward.

## MCP Servers to Connect

### Priority 1: Stripe MCP (30 min)

- **Purpose**: Direct Stripe operations (customers, subscriptions, webhooks)
- **Benefits**:
  - Create/update subscriptions without manual API calls
  - Test webhook events instantly
  - Query customer/subscription data directly
- **Installation**:
  ```bash
  npx -y @modelcontextprotocol/create-server stripe
  ```
- **Configuration**: Add to Claude Desktop config with `STRIPE_SECRET_KEY`

### Priority 2: Supabase MCP (30 min)

- **Purpose**: Database operations, RLS policies, auth management
- **Benefits**:
  - Query database directly from Claude
  - Update RLS policies
  - Manage auth users
  - Real-time subscription management
- **Installation**: Check if MCP available or use PostgreSQL MCP
- **Configuration**: Supabase connection string + service role key

### Priority 3: PostgreSQL MCP (30 min)

- **Purpose**: Direct database queries and schema operations
- **Benefits**:
  - Run complex queries without writing SQL files
  - Inspect schema and relationships
  - Debug data issues faster
- **Installation**:
  ```bash
  npx -y @modelcontextprotocol/create-server postgres
  ```
- **Configuration**: Supabase PostgreSQL connection string

### Priority 4: Resend MCP (15 min)

- **Purpose**: Email operations and template management
- **Benefits**:
  - Test email templates instantly
  - Send test emails
  - Query email logs
- **Installation**: Check MCP availability
- **Configuration**: `RESEND_API_KEY`

### Priority 5: Vercel MCP (30 min)

- **Purpose**: Deployment management and monitoring
- **Benefits**:
  - Deploy from CLI
  - Check deployment status
  - Manage environment variables
  - View logs directly
- **Installation**: Check MCP availability or use Vercel CLI
- **Configuration**: Vercel token

### Optional: DigitalOcean MCP (30 min)

- **Purpose**: Server management (if using DO for backend)
- **Benefits**: Server operations, monitoring, scaling
- **Configuration**: DO API token

## Implementation Steps

### Step 1: Install MCP Servers

```bash
# Navigate to MCP servers directory
cd ~/.config/claude-desktop/mcp-servers

# Install each server
npx -y @modelcontextprotocol/create-server stripe
npx -y @modelcontextprotocol/create-server postgres
# ... etc
```

### Step 2: Configure Claude Desktop

Edit `~/.config/claude-desktop/config.json`:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "node",
      "args": ["/path/to/stripe-mcp/index.js"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_..."
      }
    },
    "postgres": {
      "command": "node",
      "args": ["/path/to/postgres-mcp/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

### Step 3: Test Connections

- [ ] Stripe: Query customer list
- [ ] PostgreSQL: Query user_profiles table
- [ ] Resend: Send test email
- [ ] Vercel: Check deployment status

### Step 4: Document MCP Usage

- [ ] Create `.claude/mcp-usage.md` with examples
- [ ] Add to CLAUDE.md reference section
- [ ] Note any gotchas or limitations

## Acceptance Criteria

- [ ] All 5 priority MCPs installed and configured
- [ ] Each MCP tested with basic operation
- [ ] Configuration documented
- [ ] Examples added to project docs
- [ ] No sensitive credentials committed to git

## Security Notes

- Store API keys in environment variables
- Never commit MCP config with secrets to git
- Use test/development keys where possible
- Document key rotation process

## Related Documentation

- MCP GitHub: https://github.com/modelcontextprotocol
- Existing task: `.tasks/todo/mcp-integration/`
- Claude Desktop config: `~/.config/claude-desktop/config.json`

## Expected Productivity Gains

**Before MCP**:

- Stripe operation: Write code → test → debug → iterate (15-30 min)
- Database query: Write query file → run → parse results (5-10 min)
- Email test: Deploy → trigger → check inbox (10 min)

**After MCP**:

- Stripe operation: Direct command (30 seconds)
- Database query: Ask Claude → instant result (10 seconds)
- Email test: Direct send command (10 seconds)

**Net Result**: 5-10x faster iteration on every feature.
