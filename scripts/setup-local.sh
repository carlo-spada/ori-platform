#!/bin/bash

echo "🚀 Setting up Ori Platform local development environment..."

# Check for required tools
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo "❌ $1 is not installed. Please install it first."
    exit 1
  fi
}

check_command node
check_command pnpm
check_command docker

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env file from template..."
  cp .env.example .env
  echo "⚠️  Please update .env with your actual API keys!"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build shared packages
echo "🔨 Building shared packages..."
pnpm --filter "@ori/types" build
pnpm --filter "@ori/utils" build

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Run database migrations
echo "🗄️ Running database migrations..."
# Add migration command here if needed
# pnpm db:migrate

echo "✅ Setup complete!"
echo ""
echo "To start the development servers, run:"
echo "  pnpm dev"
echo ""
echo "Or run individual services:"
echo "  pnpm dev:frontend  # Frontend on http://localhost:5173"
echo "  pnpm dev:api       # API on http://localhost:3001"
echo ""
echo "Services running:"
echo "  PostgreSQL: localhost:5432"
echo "  Redis: localhost:6379"