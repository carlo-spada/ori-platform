#!/bin/bash
# MCP Server Configuration Script
# Sets up all Model Context Protocol servers for Claude Code

set -e

echo "🔧 MCP Server Setup for Ori Platform"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
BACKUP_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.backup.json"

# Backup existing config
echo -e "${YELLOW}📦 Backing up existing config...${NC}"
cp "$CONFIG_FILE" "$BACKUP_FILE"
echo -e "${GREEN}✅ Backup created at: $BACKUP_FILE${NC}"
echo ""

# Get credentials from user or .env files
echo -e "${YELLOW}📝 Gathering credentials...${NC}"
echo ""

# Check for Supabase credentials in local .env
if [ -f ".env.local" ]; then
  echo "Found .env.local - extracting Supabase credentials..."
  SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2)
  SUPABASE_ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d '=' -f2)
fi

if [ -f "services/core-api/.env" ]; then
  echo "Found core-api/.env - extracting service credentials..."
  SUPABASE_SERVICE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY services/core-api/.env | cut -d '=' -f2)
  STRIPE_SECRET=$(grep STRIPE_SECRET_KEY services/core-api/.env | cut -d '=' -f2)
fi

# Extract project ref from Supabase URL
if [ -n "$SUPABASE_URL" ]; then
  PROJECT_REF=$(echo "$SUPABASE_URL" | sed -E 's|https://([^.]+)\.supabase\.co|\1|')
  DB_HOST="db.${PROJECT_REF}.supabase.co"
  DB_CONNECTION="postgresql://postgres.${PROJECT_REF}:${SUPABASE_SERVICE_KEY}@${DB_HOST}:5432/postgres"
fi

# Prompt for missing credentials
echo ""
echo -e "${YELLOW}Enter missing credentials (or press Enter to skip):${NC}"
echo ""

if [ -z "$SUPABASE_SERVICE_KEY" ]; then
  read -p "Supabase Service Role Key: " SUPABASE_SERVICE_KEY
fi

if [ -z "$STRIPE_SECRET" ]; then
  read -p "Stripe Secret Key (sk_test_...): " STRIPE_SECRET
fi

read -p "GitHub Personal Access Token (classic, repo scope): " GITHUB_TOKEN
read -p "Resend API Key (optional, press Enter to skip): " RESEND_KEY
read -p "Supabase Personal Access Token (optional): " SUPABASE_PAT

echo ""
echo -e "${GREEN}✅ Credentials collected${NC}"
echo ""

# Generate new config
echo -e "${YELLOW}🔨 Generating new MCP configuration...${NC}"

cat > "$CONFIG_FILE" << EOF
{
  "preferences": {
    "quickEntryDictationShortcut": "off",
    "menuBarEnabled": false,
    "quickEntryShortcut": "off"
  },
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/carlo/Desktop/Projects/ori-platform"]
    }
EOF

# Add Postgres if we have credentials
if [ -n "$DB_CONNECTION" ]; then
  cat >> "$CONFIG_FILE" << EOF
,
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "$DB_CONNECTION"]
    }
EOF
  echo -e "${GREEN}✅ Postgres MCP configured${NC}"
else
  echo -e "${YELLOW}⚠️  Postgres MCP skipped (missing credentials)${NC}"
fi

# Add GitHub if we have token
if [ -n "$GITHUB_TOKEN" ]; then
  cat >> "$CONFIG_FILE" << EOF
,
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": "$GITHUB_TOKEN"}
    }
EOF
  echo -e "${GREEN}✅ GitHub MCP configured${NC}"
else
  echo -e "${YELLOW}⚠️  GitHub MCP skipped${NC}"
fi

# Add Supabase if we have PAT
if [ -n "$SUPABASE_PAT" ]; then
  cat >> "$CONFIG_FILE" << EOF
,
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "$SUPABASE_PAT"
      ]
    }
EOF
  echo -e "${GREEN}✅ Supabase MCP configured${NC}"
else
  echo -e "${YELLOW}⚠️  Supabase MCP skipped${NC}"
fi

# Close JSON
cat >> "$CONFIG_FILE" << EOF

  }
}
EOF

echo ""
echo -e "${GREEN}✅ MCP configuration complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Restart Claude Desktop app completely"
echo "2. Open Claude Code and verify MCP servers are connected"
echo "3. Test with: 'List available MCP tools'"
echo ""
echo -e "${YELLOW}📁 Files:${NC}"
echo "  Config: $CONFIG_FILE"
echo "  Backup: $BACKUP_FILE"
echo ""
echo -e "${RED}⚠️  SECURITY:${NC} Keep your config file secure - it contains API keys!"
