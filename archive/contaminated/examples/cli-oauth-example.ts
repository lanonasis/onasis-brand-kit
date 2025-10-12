#!/usr/bin/env bun

/**
 * Example CLI tool demonstrating OAuth authentication flow
 * Run with: bun run examples/cli-oauth-example.ts
 */

import { MCPClient } from '@lanonasis/oauth-client';

async function main() {
  console.log('🚀 Lan Onasis MCP CLI Example\n');

  // Initialize MCP client
  const mcp = new MCPClient({
    clientId: 'lanonasis-mcp-cli',
    mcpEndpoint: 'wss://mcp.lanonasis.com'
  });

  try {
    // Connect (will trigger OAuth flow if not authenticated)
    console.log('Connecting to Lan Onasis...');
    await mcp.connect();
    
    console.log('✅ Successfully connected!\n');

    // Example: Create a memory
    console.log('Creating a test memory...');
    const memory = await mcp.createMemory(
      'My Test Memory',
      'This is a test memory created via the CLI OAuth example.',
      {
        type: 'context',
        tags: ['test', 'cli', 'oauth']
      }
    );
    console.log('✅ Memory created:', memory.id);

    // Example: Search memories
    console.log('\nSearching for memories...');
    const results = await mcp.searchMemories('test', { limit: 5 });
    console.log(`Found ${results.length} memories:`);
    results.forEach((mem: any) => {
      console.log(`  - ${mem.title} (${mem.id})`);
    });

    // Example: Get memory details
    if (memory.id) {
      console.log('\nRetrieving memory details...');
      const details = await mcp.getMemory(memory.id);
      console.log('Memory details:', details);
    }

    // Logout when done
    console.log('\nLogging out...');
    await mcp.logout();
    console.log('✅ Logged out successfully');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', async () => {
  console.log('\n\nReceived interrupt signal, cleaning up...');
  process.exit(0);
});

// Run the example
main().catch(console.error);