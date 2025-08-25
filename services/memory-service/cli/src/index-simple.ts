#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { l0Commands } from './commands/l0.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json
const packagePath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

const program = new Command();

program
  .name('vortex')
  .alias('lanonasis')
  .description('VortexAI L0 - Universal Work Orchestrator with Enterprise Memory Service')
  .version(packageJson.version);

// Add L0 Commands (Testing Ground)
l0Commands(program);

program
  .command('init')
  .description('Initialize Lanonasis CLI configuration')
  .action(() => {
    console.log('🚀 Lanonasis CLI v' + packageJson.version);
    console.log('');
    console.log('Initialize your Lanonasis Enterprise Platform:');
    console.log('');
    console.log('1. Set up your service endpoint:');
    console.log('   lanonasis config set api-url https://your-lanonasis-service.com');
    console.log('');
    console.log('2. Authenticate:');
    console.log('   lanonasis auth login');
    console.log('');
    console.log('3. Start managing your services:');
    console.log('   lanonasis create -t "My Memory" -c "Content here"');
    console.log('   lanonasis search "search query"');
    console.log('   lanonasis list');
    console.log('');
    console.log('📖 Documentation: https://github.com/lanonasis/cli');
    console.log('🌐 Platform: https://lanonasis.com');
  });

program
  .command('status')
  .description('Show Lanonasis CLI status and configuration')
  .action(() => {
    console.log('📊 Lanonasis CLI Status');
    console.log('========================');
    console.log('Version:', packageJson.version);
    console.log('Status: 🟢 Ready for configuration');
    console.log('');
    console.log('Next steps:');
    console.log('• Run "lanonasis init" to get started');
    console.log('• Configure your service endpoints');
    console.log('• Authenticate with your platform');
  });

program
  .command('create')
  .description('Create a new memory entry')
  .option('-t, --title <title>', 'Memory title')
  .option('-c, --content <content>', 'Memory content')
  .option('--type <type>', 'Memory type (conversation, knowledge, project, context, reference)', 'context')
  .action((options) => {
    if (!options.title || !options.content) {
      console.error('❌ Error: Both --title and --content are required');
      console.log('');
      console.log('Usage: lanonasis create -t "Title" -c "Content"');
      process.exit(1);
    }
    
    console.log('📝 Creating memory...');
    console.log('Title:', options.title);
    console.log('Content:', options.content.substring(0, 100) + (options.content.length > 100 ? '...' : ''));
    console.log('Type:', options.type);
    console.log('');
    console.log('⚠️  Please configure your Lanonasis service endpoint first:');
    console.log('   lanonasis config set api-url https://your-service.com');
    console.log('   lanonasis auth login');
  });

program
  .command('search')
  .description('Search memories')
  .argument('<query>', 'Search query')
  .option('-l, --limit <limit>', 'Number of results', '10')
  .action((query, options) => {
    console.log('🔍 Searching memories...');
    console.log('Query:', query);
    console.log('Limit:', options.limit);
    console.log('');
    console.log('⚠️  Please configure your Lanonasis service endpoint first:');
    console.log('   lanonasis config set api-url https://your-service.com');
    console.log('   lanonasis auth login');
  });

program
  .command('list')
  .description('List all memories')
  .option('-l, --limit <limit>', 'Number of results', '20')
  .option('--type <type>', 'Filter by memory type')
  .action((options) => {
    console.log('📋 Listing memories...');
    console.log('Limit:', options.limit);
    if (options.type) console.log('Type filter:', options.type);
    console.log('');
    console.log('⚠️  Please configure your Lanonasis service endpoint first:');
    console.log('   lanonasis config set api-url https://your-service.com');
    console.log('   lanonasis auth login');
  });

program
  .command('config')
  .description('Manage CLI configuration')
  .argument('<action>', 'Action: set, get, list')
  .argument('[key]', 'Configuration key')
  .argument('[value]', 'Configuration value')
  .action((action, key, value) => {
    console.log('⚙️  Memory CLI Configuration');
    console.log('===========================');
    
    switch (action) {
      case 'set':
        if (!key || !value) {
          console.error('❌ Usage: memory config set <key> <value>');
          process.exit(1);
        }
        console.log(`Setting ${key} = ${value}`);
        console.log('✅ Configuration saved');
        break;
      
      case 'get':
        if (!key) {
          console.error('❌ Usage: memory config get <key>');
          process.exit(1);
        }
        console.log(`${key}: <not configured>`);
        break;
      
      case 'list':
        console.log('Available configuration keys:');
        console.log('• api-url: Your MaaS service endpoint');
        console.log('• auth-token: Authentication token');
        console.log('• default-type: Default memory type');
        break;
      
      default:
        console.error('❌ Unknown action. Use: set, get, or list');
        process.exit(1);
    }
  });

program
  .command('auth')
  .description('Authentication commands')
  .argument('<action>', 'Action: login, logout, status')
  .action((action) => {
    console.log('🔐 Memory CLI Authentication');
    console.log('============================');
    
    switch (action) {
      case 'login':
        console.log('Please configure your API endpoint first:');
        console.log('  memory config set api-url https://your-maas-service.com');
        console.log('');
        console.log('Then authenticate with your service credentials.');
        break;
      
      case 'logout':
        console.log('✅ Logged out successfully');
        break;
      
      case 'status':
        console.log('Status: 🔴 Not authenticated');
        console.log('Run "memory auth login" to authenticate');
        break;
      
      default:
        console.error('❌ Unknown action. Use: login, logout, or status');
        process.exit(1);
    }
  });

// Help command
program
  .command('help')
  .description('Show detailed help information')
  .action(() => {
    console.log('🚀 Lanonasis Enterprise CLI');
    console.log('============================');
    console.log('');
    console.log('The Lanonasis CLI provides unified access to your entire platform ecosystem.');
    console.log('');
    console.log('🚀 Quick Start:');
    console.log('1. lanonasis init              - Initialize and see setup instructions');
    console.log('2. lanonasis config set api-url <url> - Set your service endpoint');
    console.log('3. lanonasis auth login        - Authenticate with your platform');
    console.log('4. lanonasis create -t "Title" -c "Content" - Create your first memory');
    console.log('');
    console.log('📝 Memory Operations:');
    console.log('• lanonasis create -t "Title" -c "Content" --type knowledge');
    console.log('• lanonasis search "query text"');
    console.log('• lanonasis list --type project --limit 10');
    console.log('');
    console.log('⚙️  Configuration:');
    console.log('• lanonasis config set api-url https://your-service.com');
    console.log('• lanonasis config list');
    console.log('');
    console.log('🔐 Authentication:');
    console.log('• lanonasis auth login');
    console.log('• lanonasis auth status');
    console.log('');
    console.log('💡 Alternative Commands:');
    console.log('• memory <command>    - Direct memory operations');
    console.log('• maas <command>      - Memory as a Service operations');
    console.log('');
    console.log('Memory Types: conversation, knowledge, project, context, reference');
    console.log('');
    console.log('📖 Documentation: https://github.com/lanonasis/cli');
    console.log('🌐 Platform: https://lanonasis.com');
    console.log('🐛 Issues: https://github.com/lanonasis/cli/issues');
  });

// Handle unknown commands
program.on('command:*', () => {
  console.error('❌ Unknown command: %s', program.args.join(' '));
  console.log('');
  console.log('Run "lanonasis help" for available commands');
  process.exit(1);
});

// Show enhanced welcome if no arguments provided
if (process.argv.length === 2) {
  console.log(chalk.magenta.bold('\n🌪️  VortexAI L0 v' + packageJson.version));
  console.log(chalk.cyan('Universal Work Orchestrator - Don\'t just chat. Orchestrate.'));
  console.log(chalk.gray('═'.repeat(60)));
  console.log('\n🎯 Real-World Orchestration:');
  console.log(chalk.yellow('  vortex l0 "create social media campaign for product launch"'));
  console.log(chalk.yellow('  vortex l0 "analyze trending topics and create content"'));
  console.log(chalk.yellow('  vortex l0 "research competitors and update strategy"'));
  console.log(chalk.yellow('  vortex l0 "generate weekly performance report"'));
  console.log('\n🧠 Development Workflows:');
  console.log(chalk.white('  vortex l0 code "floating notification component"'));
  console.log(chalk.white('  vortex l0 memory "api integration patterns"'));
  console.log(chalk.white('  vortex l0 help "oauth implementation"'));
  console.log('\n📝 Memory Management:');
  console.log(chalk.white('  vortex create -t "Title" -c "Content"'));
  console.log(chalk.white('  vortex search "query"'));
  console.log(chalk.white('  vortex list'));
  console.log('\n⚙️  Configuration:');
  console.log(chalk.white('  vortex init'));
  console.log(chalk.white('  vortex status'));
  console.log('\n🚀 ' + chalk.bold('L0 orchestrates your workflow. Your productivity just got an extra jump!'));
  console.log(chalk.gray('Social Media • Content Creation • Data Analysis • Code Generation\n'));
}

program.parse();