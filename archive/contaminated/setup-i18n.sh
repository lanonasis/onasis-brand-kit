#!/bin/bash

# LanOnasis Monorepo i18n Setup Script
set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}🌍 Setting up Lingo.dev CLI for LanOnasis Monorepo${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "i18n.json" ]; then
    echo -e "${YELLOW}⚠️  i18n.json not found. Please run this script from the monorepo root.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing Lingo.dev CLI...${NC}"
bun install -g @lingo-dev/cli@latest

echo -e "${BLUE}🔧 Setting up environment variables...${NC}"

# Check if .env exists, create if not
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Lingo.dev CLI Configuration
# Choose one of the following API providers:

# Option 1: OpenAI (Recommended for most languages)
# OPENAI_API_KEY=your_openai_api_key_here

# Option 2: Anthropic Claude (Great for technical content)
# ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Option 3: Lingo.dev Engine (Specialized for i18n)
# Use 'bun run i18n:setup' to configure via browser

# Debug mode (optional)
# LINGO_DEBUG=true
EOF
    echo -e "${GREEN}✅ Created .env file${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
fi

echo -e "${BLUE}🏗️  Verifying directory structure...${NC}"

# Ensure all locale directories exist
APPS=("vortexcore" "vortexcore-saas" "maple-site" "lanonasis-index")

for app in "${APPS[@]}"; do
    mkdir -p "apps/$app/locales"
    if [ ! -f "apps/$app/locales/en.json" ]; then
        echo -e "${YELLOW}⚠️  apps/$app/locales/en.json not found${NC}"
    else
        echo -e "${GREEN}✅ apps/$app/locales/en.json exists${NC}"
    fi
done

# Ensure shared package exists
mkdir -p "packages/shared/locales"
if [ ! -f "packages/shared/locales/en.json" ]; then
    echo -e "${YELLOW}⚠️  packages/shared/locales/en.json not found${NC}"
else
    echo -e "${GREEN}✅ packages/shared/locales/en.json exists${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Add your API key to .env file:"
echo "   - For OpenAI: OPENAI_API_KEY=your_key"
echo "   - For Anthropic: ANTHROPIC_API_KEY=your_key"
echo "   - For Lingo.dev: Run 'bun run i18n:setup'"
echo ""
echo "2. Test the setup:"
echo "   bun run i18n:check"
echo ""
echo "3. Generate translations:"
echo "   bun run i18n"
echo ""
echo -e "${BLUE}Available commands:${NC}"
echo "  bun run i18n          - Generate all translations"
echo "  bun run i18n:check    - Preview what would be translated"
echo "  bun run i18n:setup    - Initialize Lingo.dev configuration"
echo ""
echo -e "${GREEN}🌍 Your monorepo is now ready for global scale!${NC}"