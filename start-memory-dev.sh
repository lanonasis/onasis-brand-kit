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
