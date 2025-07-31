#!/bin/bash

# Comprehensive Memory Service Development Startup Script
# Starts all memory service components in development mode

echo "🧠 Starting Memory Service Development Environment"
echo "=================================================="

# Check environment file
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "   Please run './setup-memory-integration.sh' first"
    exit 1
fi

# Source environment variables
source .env

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $port is already in use"
        return 1
    fi
    return 0
}

# Function to start a service in background
start_service() {
    local name=$1
    local command=$2
    local port=$3
    
    echo "🚀 Starting $name on port $port..."
    
    if check_port $port; then
        eval "$command" &
        local pid=$!
        echo $pid > "/tmp/memory-dev-$name.pid"
        echo "✅ $name started (PID: $pid)"
        sleep 2
    else
        echo "❌ Cannot start $name - port $port in use"
        return 1
    fi
}

# Function to check service health
check_service_health() {
    local name=$1
    local url=$2
    local max_attempts=10
    local attempt=1
    
    echo "🔍 Checking $name health..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo "✅ $name is healthy"
            return 0
        fi
        echo "⏳ Waiting for $name... (attempt $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ $name failed to start properly"
    return 1
}

# Store PIDs for cleanup
trap cleanup EXIT

cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    
    # Kill all started services
    for pid_file in /tmp/memory-dev-*.pid; do
        if [ -f "$pid_file" ]; then
            pid=$(cat "$pid_file")
            service_name=$(basename "$pid_file" .pid | sed 's/memory-dev-//')
            echo "🔻 Stopping $service_name (PID: $pid)"
            kill $pid 2>/dev/null
            rm -f "$pid_file"
        fi
    done
    
    echo "✅ All services stopped"
}

echo ""
echo "📋 Starting services..."
echo "===================="

# 1. Start Memory Service API (if using local)
if [ "$USE_LOCAL_MEMORY" = "true" ]; then
    MEMORY_PORT=${MEMORY_API_PORT:-3001}
    start_service "memory-api" "cd services/memory-service && bun run dev" $MEMORY_PORT
else
    echo "🌐 Using production memory service: $MEMORY_SERVICE_URL"
fi

# 2. Start MCP Server (if enabled)
if [ "$ENABLE_MEMORY_MCP" = "true" ]; then
    MCP_PORT=${MEMORY_MCP_PORT:-3002}
    start_service "mcp-server" "npx -y @lanonasis/cli mcp start --port $MCP_PORT" $MCP_PORT
fi

# 3. Start Integration Router
ROUTER_PORT=${PORT:-3000}
start_service "integration-router" "node services/memory-integration.js" $ROUTER_PORT

# 4. Start other monorepo services (optional)
if [ "$ENABLE_ALL_SERVICES" = "true" ]; then
    echo "🌟 Starting all monorepo services..."
    turbo run dev --filter='!@lanonasis/memory-service' &
    echo $! > "/tmp/memory-dev-monorepo.pid"
fi

echo ""
echo "⏳ Waiting for services to be ready..."
echo "=================================="

# Health checks
sleep 3

# Check Memory API (if local)
if [ "$USE_LOCAL_MEMORY" = "true" ]; then
    check_service_health "Memory API" "http://localhost:${MEMORY_API_PORT:-3001}/api/v1/health"
fi

# Check MCP Server (if enabled) 
if [ "$ENABLE_MEMORY_MCP" = "true" ]; then
    # MCP uses WebSocket, so we'll just check if the process is running
    if pgrep -f "mcp start" > /dev/null; then
        echo "✅ MCP Server is running"
    else
        echo "❌ MCP Server may have failed to start"
    fi
fi

# Check Integration Router
check_service_health "Integration Router" "http://localhost:${PORT:-3000}/health"

echo ""
echo "🎉 Memory Service Development Environment Ready!"
echo "=============================================="
echo ""
echo "📊 Service Status:"
echo "=================="

if [ "$USE_LOCAL_MEMORY" = "true" ]; then
    echo "🧠 Memory API:        http://localhost:${MEMORY_API_PORT:-3001}"
    echo "📚 API Docs:          http://localhost:${MEMORY_API_PORT:-3001}/docs"
fi

if [ "$ENABLE_MEMORY_MCP" = "true" ]; then
    echo "🤖 MCP Server:        ws://localhost:${MEMORY_MCP_PORT:-3002}"
fi

echo "🔀 Integration Router: http://localhost:${PORT:-3000}"
echo "❤️  Health Check:      http://localhost:${PORT:-3000}/health"

echo ""
echo "🛠️  Available Commands:"
echo "======================"
echo "• bun run memory:cli          # Access CLI tools"
echo "• bun run memory:mcp          # Start MCP server separately"
echo "• curl localhost:3000/health  # Check service health"
echo ""
echo "🔧 IDE Extensions:"
echo "=================="
echo "• VSCode:    tools/vscode-memory-extension/lanonasis-memory-1.0.0.vsix"
echo "• Cursor:    tools/cursor-memory-extension/lanonasis-memory-cursor-1.0.0.vsix"
echo "• Windsurf:  tools/windsurf-memory-extension/lanonasis-memory-windsurf-1.0.0.vsix"
echo ""
echo "📚 Documentation:"
echo "================="
echo "• Integration Guide: packages/onasis-core/MEMORY_SERVICE_INTEGRATION_GUIDE.md"
echo "• Quick Reference:   packages/onasis-core/MEMORY_INTEGRATION_QUICK_REFERENCE.md"
echo ""
echo "💡 Tip: Set ENABLE_ALL_SERVICES=true to start all monorepo services"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Keep script running
wait