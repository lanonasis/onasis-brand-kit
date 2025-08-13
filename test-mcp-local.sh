#!/bin/bash

echo "🧪 Testing Lanonasis MCP Tools Locally"
echo "======================================="

# Export environment variables for MCP
export LANONASIS_API_URL="http://localhost:3000"
export LANONASIS_API_KEY="test-key-local"

echo -e "\n1️⃣ Testing Health Check..."
curl -X GET http://localhost:3000/api/v1/health \
  -H "Content-Type: application/json" | jq .

echo -e "\n2️⃣ Creating Test Memory..."
curl -X POST http://localhost:3000/api/v1/memory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-key-local" \
  -d '{
    "title": "MCP Test Memory",
    "content": "This is a test memory created via direct API call to verify the backend is working",
    "memory_type": "context",
    "tags": ["test", "mcp", "verification"]
  }' | jq .

echo -e "\n3️⃣ Searching Memories..."
curl -X POST http://localhost:3000/api/v1/memory/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-key-local" \
  -d '{
    "query": "test",
    "limit": 5
  }' | jq .

echo -e "\n4️⃣ Listing Memories..."
curl -X GET http://localhost:3000/api/v1/memory \
  -H "Authorization: Bearer test-key-local" | jq .

echo -e "\n======================================="
echo "✅ Local backend test complete!"
echo ""
echo "To use with MCP, add to your Claude config:"
echo '  "lanonasis": {'
echo '    "command": "npx",'
echo '    "args": ["@lanonasis/cli", "mcp"],'
echo '    "env": {'
echo '      "LANONASIS_API_URL": "http://localhost:3000",'
echo '      "LANONASIS_API_KEY": "your-api-key"'
echo '    }'
echo '  }'
