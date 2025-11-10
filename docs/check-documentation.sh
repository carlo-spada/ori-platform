#!/bin/bash
# Documentation Health Check Script
# Prevents documentation explosion by tracking key metrics
# Run: bash docs/check-documentation.sh

set -e

echo ""
echo "📊 Documentation Health Check"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Count files
TOTAL=$(find docs -name "*.md" -not -path "*/node_modules/*" | wc -l)
ACTIVE=$(find docs -name "*.md" -not -path "*/archive/*" -not -path "*/node_modules/*" | wc -l)
ARCHIVED=$(find docs/archive -name "*.md" -not -path "*/node_modules/*" 2>/dev/null | wc -l || echo "0")

echo "📈 File Counts:"
echo "   Total: $TOTAL"
echo "   Active: $ACTIVE (docs/)"
echo "   Archived: $ARCHIVED (docs/archive/)"
echo ""

# Check if file count is reasonable
if [ "$ACTIVE" -gt 30 ]; then
    echo -e "${YELLOW}⚠️  Warning: $ACTIVE active docs (consider consolidation)${NC}"
fi

# Check for common duplicate patterns
echo "🔍 Checking for Suspicious Naming Patterns..."
echo ""

# Count files with same prefix
PREFIXES=$(find docs -maxdepth 1 -name "*.md" -not -path "*/archive/*" | sed 's/.*\///' | sed 's/_[^_]*\.md$//' | sort | uniq -c | sort -rn)

SUSPICIOUS=false
while read -r count prefix; do
    if [ "$count" -gt 2 ]; then
        echo -e "${RED}⚠️  Found $count files with prefix: ${prefix}_*${NC}"
        find docs -maxdepth 1 -name "${prefix}_*.md" -not -path "*/archive/*" | sed 's/.*\///'
        echo ""
        SUSPICIOUS=true
    fi
done <<< "$PREFIXES"

if [ "$SUSPICIOUS" = false ]; then
    echo -e "${GREEN}✅ No suspicious naming patterns found${NC}"
fi
echo ""

# Check for orphaned files (not in any index)
echo "🔗 Checking for Orphaned Files (Not Indexed)..."
echo ""

ORPHANED_COUNT=0
while IFS= read -r file; do
    filename=$(basename "$file" .md)
    # Check if filename appears in any index file
    if ! grep -l "$filename" docs/*INDEX*.md 2>/dev/null | grep -q .; then
        if ! grep -l "$filename" docs/MCP_DOCUMENTATION_INDEX.md 2>/dev/null | grep -q .; then
            echo "   - $filename"
            ((ORPHANED_COUNT++))
        fi
    fi
done < <(find docs -maxdepth 1 -name "*.md" -type f)

if [ "$ORPHANED_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ All active docs are indexed${NC}"
else
    echo -e "${RED}⚠️  Found $ORPHANED_COUNT orphaned files${NC}"
fi
echo ""

# Check for files with similar content (potential duplicates)
echo "📄 Checking for Similar Content (Potential Duplicates)..."
echo ""

# Look for files with "# " headings that are the same
SIMILAR=$(find docs -maxdepth 1 -name "*.md" -type f | while read f1; do
    head -1 "$f1" | sed "s/^/$f1:/"
done | cut -d: -f2 | sort | uniq -d | wc -l)

if [ "$SIMILAR" -eq 0 ]; then
    echo -e "${GREEN}✅ No duplicate headings found${NC}"
else
    echo -e "${YELLOW}⚠️  Found $SIMILAR similar headings (check manually)${NC}"
fi
echo ""

# Check for stale files (not modified in 3+ months)
echo "📅 Files Not Updated in 3+ Months:"
echo ""

STALE_COUNT=$(find docs -maxdepth 1 -name "*.md" -type f -mtime +90 | wc -l)

if [ "$STALE_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ No stale files found${NC}"
else
    echo -e "${YELLOW}⚠️  Found $STALE_COUNT stale files:${NC}"
    find docs -maxdepth 1 -name "*.md" -type f -mtime +90 -exec ls -lh {} \; | awk '{print "   - " $9 " (" $6 " " $7 " " $8 ")"}'
fi
echo ""

# Check for broken internal links
echo "🔗 Checking for Broken Internal Links..."
echo ""

BROKEN_COUNT=0
while IFS= read -r file; do
    while IFS= read -r link; do
        link_target=$(echo "$link" | sed 's/.*\[(.*)\].*/\1/' | sed 's/^/docs\//')
        # Check if it's an external link
        if [[ ! "$link_target" =~ ^https?:// ]]; then
            if [ ! -f "$link_target" ]; then
                echo "   - In $(basename $file): $link"
                ((BROKEN_COUNT++))
            fi
        fi
    done < <(grep -o '\[.*\]([^)]*)' "$file" 2>/dev/null || true)
done < <(find docs -maxdepth 1 -name "*.md" -type f)

if [ "$BROKEN_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ No broken internal links found${NC}"
else
    echo -e "${RED}⚠️  Found $BROKEN_COUNT broken links${NC}"
fi
echo ""

# Summary
echo "=============================="
echo "📋 Summary"
echo "=============================="
echo ""

if [ "$ACTIVE" -le 25 ] && [ "$ORPHANED_COUNT" -eq 0 ] && [ "$BROKEN_COUNT" -eq 0 ] && [ "$SUSPICIOUS" = false ]; then
    echo -e "${GREEN}✅ Documentation Health: EXCELLENT${NC}"
    echo "   No issues detected"
else
    echo -e "${YELLOW}⚠️  Documentation Health: NEEDS ATTENTION${NC}"
    echo "   - Active files: $ACTIVE (ideal: 20-25)"
    echo "   - Orphaned docs: $ORPHANED_COUNT (ideal: 0)"
    echo "   - Broken links: $BROKEN_COUNT (ideal: 0)"
    echo "   - Suspicious patterns: $([ "$SUSPICIOUS" = false ] && echo "No" || echo "Yes")"
fi
echo ""
echo "See: docs/DOCUMENTATION_GOVERNANCE.md for prevention strategies"
echo ""
