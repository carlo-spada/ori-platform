#!/bin/bash

# Revolutionary Onboarding Migration Script
# This will reset the database and create the new schema

set -e

echo "================================================"
echo "🚀 Revolutionary Onboarding Migration"
echo "================================================"
echo ""
echo "⚠️  WARNING: This will DELETE ALL EXISTING DATA"
echo "This migration will:"
echo "  - Drop all existing tables"
echo "  - Create new progressive onboarding schema"
echo "  - Set up session persistence"
echo "  - Add analytics tracking"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Migration cancelled."
    exit 0
fi

echo ""
echo "Running migration..."

# Run the migration using Supabase CLI
npx supabase migration up --local

# Or if using direct database connection:
# npx supabase db push --local

echo ""
echo "✅ Migration completed successfully!"
echo ""
echo "Next steps:"
echo "1. Test the new onboarding flow at /onboarding/v2"
echo "2. Deploy to production when ready"
echo "3. Monitor analytics for user behavior"
echo ""
echo "================================================"