#!/bin/bash

echo "🔍 Testing Lan Onasis Memory Service..."
echo "========================================="

# Test local backend
echo -e "\n1️⃣ Testing Local Backend (http://localhost:3000)..."
curl -s http://localhost:3000/api/v1/health | jq . || echo "❌ Local backend not running"

# Test production API
echo -e "\n2️⃣ Testing Production API (https://dashboard.lanonasis.com)..."
curl -s https://dashboard.lanonasis.com/api/v1/health | head -n 5

# Test API endpoint
echo -e "\n3️⃣ Testing API endpoint (https://api.lanonasis.com)..."
curl -s https://api.lanonasis.com/api/v1/health | jq . || echo "❌ API endpoint not accessible"

echo -e "\n========================================="
echo "✅ Test complete!"
