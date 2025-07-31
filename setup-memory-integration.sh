#!/bin/bash

# Memory Service Integration Setup Script
# Based on packages/onasis-core/MEMORY_SERVICE_INTEGRATION_GUIDE.md

echo "🚀 Setting up Memory Service Integration for Lan Onasis Monorepo"
echo "================================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
    echo "❌ Error: Please run this script from the monorepo root directory"
    exit 1
fi

# Step 1: Verify Memory Service is Present
echo "📂 Checking memory service presence..."
if [ ! -d "services/memory-service" ]; then
    echo "❌ Error: Memory service not found at services/memory-service"
    echo "   Please ensure you've copied the vibe-memory service to services/memory-service"
    exit 1
fi
echo "✅ Memory service found"

# Step 2: Create environment file if it doesn't exist
echo "🔧 Setting up environment configuration..."
if [ ! -f ".env" ]; then
    cp .env.memory.example .env
    echo "📝 Created .env file from template"
    echo "⚠️  Please edit .env with your actual credentials before proceeding"
else
    echo "✅ .env file already exists"
fi

# Step 3: Install dependencies
echo "📦 Installing dependencies..."
if command -v bun &> /dev/null; then
    bun install
    echo "✅ Dependencies installed with Bun"
else
    npm install
    echo "✅ Dependencies installed with npm"
fi

# Step 4: Verify symlinks
echo "🔗 Verifying symlinks..."
symlinks=(
    "packages/external/memory-sdk"
    "tools/memory-cli"
    "tools/vscode-memory-extension"
    "tools/cursor-memory-extension"
    "tools/windsurf-memory-extension"
)

for symlink in "${symlinks[@]}"; do
    if [ -L "$symlink" ]; then
        echo "✅ Symlink verified: $symlink"
    else
        echo "❌ Missing symlink: $symlink"
        exit 1
    fi
done

# Step 5: Build memory service components
echo "🔨 Building memory service components..."
if command -v turbo &> /dev/null; then
    turbo run build --filter=...memory-service
    echo "✅ Memory service components built"
else
    echo "⚠️  Turbo not found, skipping build step"
fi

# Step 6: Verify MCP CLI is available
echo "🤖 Verifying MCP CLI..."
if command -v npx &> /dev/null; then
    if npx -y @lanonasis/cli --version &> /dev/null; then
        echo "✅ @lanonasis/cli is available"
    else
        echo "⚠️  @lanonasis/cli not found, it will be installed on first use"
    fi
else
    echo "⚠️  npx not found, please ensure Node.js is installed"
fi

# Step 7: Create quick start script
echo "📋 Creating quick start script..."
cat > start-memory-dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Memory Service Development Environment"
echo "=================================================="

# Start all services in development mode
echo "Starting all services..."
turbo run dev &

# Wait a moment for services to start
sleep 3

# Start MCP server
echo "Starting MCP server..."
npx -y @lanonasis/cli mcp start &

echo "✅ All services started!"
echo ""
echo "Available endpoints:"
echo "- Memory API: http://localhost:3001"
echo "- MCP Server: ws://localhost:3002"
echo ""
echo "Available commands:"
echo "- bun run memory:dev     # Start memory service only"
echo "- bun run memory:mcp     # Start MCP server only"
echo "- bun run memory:cli     # Access CLI tools"
echo ""
echo "Press Ctrl+C to stop all services"
wait
EOF

chmod +x start-memory-dev.sh

echo ""
echo "🎉 Memory Service Integration Setup Complete!"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Edit .env with your actual credentials"
echo "2. Run './start-memory-dev.sh' to start development environment"
echo "3. Test MCP integration with: bun run memory:mcp"
echo "4. Install IDE extensions from tools/ directory"
echo ""
echo "Documentation:"
echo "- Integration Guide: packages/onasis-core/MEMORY_SERVICE_INTEGRATION_GUIDE.md"
echo "- Quick Reference: packages/onasis-core/MEMORY_INTEGRATION_QUICK_REFERENCE.md"
echo ""
echo "Happy coding! 🚀"