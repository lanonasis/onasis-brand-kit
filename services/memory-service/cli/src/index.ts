#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { config } from 'dotenv';

import { initCommand } from './commands/init.js';
import { loginCommand } from './commands/auth.js';
import { memoryCommands } from './commands/memory.js';
import { topicCommands } from './commands/topics.js';
import { configCommands } from './commands/config.js';
import { orgCommands } from './commands/organization.js';
import { mcpCommands } from './commands/mcp.js';
import { CLIConfig } from './utils/config.js';
import { getMCPClient } from './utils/mcp-client.js';
import { TabCompletions } from './utils/completions.js';
import { output } from './utils/output.js';

// Load environment variables
config();

const program = new Command();

// CLI Configuration
const cliConfig = new CLIConfig();

program
  .name('lanonasis')
  .alias('onasis')
  .description('Lanonasis Unified CLI - Enterprise AI Infrastructure & Memory as a Service')
  .version('1.5.0')
  .option('-v, --verbose', 'enable verbose logging')
  .option('--api-url <url>', 'override API URL (default: https://api.lanonasis.com)')
  .option('--output <format>', 'output format (json, table, yaml)', 'table')
  .option('--no-mcp', 'disable MCP and use direct API')
  .option('--api-key <key>', 'use API key authentication (bypasses interactive login)')
  .option('--silent', 'suppress non-essential output (implied with --output json)')
  .hook('preAction', async (thisCommand, actionCommand) => {
    const opts = thisCommand.opts();
    if (opts.verbose) {
      process.env.CLI_VERBOSE = 'true';
    }
    if (opts.apiUrl) {
      process.env.MEMORY_API_URL = opts.apiUrl;
    }
    if (opts.apiKey) {
      process.env.LANONASIS_API_KEY = opts.apiKey;
    }
    process.env.CLI_OUTPUT_FORMAT = opts.output;
    
    // Configure output manager
    output.setOptions({
      format: opts.output,
      silent: opts.silent,
      json: opts.output === 'json'
    });
    
    // Auto-initialize MCP unless disabled
    if (opts.mcp !== false && !['init', 'auth', 'login', 'mcp', 'help'].includes(actionCommand.name())) {
      try {
        const client = getMCPClient();
        if (!client.isConnectedToServer()) {
          const useRemote = await cliConfig.isAuthenticated() || !!opts.apiKey;
          await client.connect({ useRemote });
          if (process.env.CLI_VERBOSE === 'true' && !output.isSilent()) {
            output.log(chalk.gray(`MCP connected (${useRemote ? 'remote' : 'local'})`));
          }
        }
      } catch {
        if (process.env.CLI_VERBOSE === 'true' && !output.isSilent()) {
          output.log(chalk.yellow('MCP auto-connect failed, using direct API'));
        }
      }
    }
  });

// Global error handler
process.on('uncaughtException', (error) => {
  output.error(chalk.red('✖ Unexpected error:'), error.message);
  if (process.env.CLI_VERBOSE === 'true' && !output.isJsonOutput()) {
    console.error(error.stack);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  output.error(chalk.red('✖ Unhandled promise rejection:'), reason);
  if (process.env.CLI_VERBOSE === 'true' && !output.isJsonOutput()) {
    console.error(promise);
  }
  process.exit(1);
});

// Welcome message for first-time users
const showWelcome = () => {
  if (!output.isSilent()) {
    console.log(chalk.blue.bold('🚀 Lanonasis CLI - Enterprise AI Infrastructure'));
    console.log(chalk.gray('Memory as a Service, AI Orchestration & Multi-tenant Infrastructure'));
    console.log();
    console.log(chalk.yellow('Quick Start:'));
    console.log(chalk.white('  lanonasis login        # Interactive authentication'));
    console.log(chalk.white('  onasis -h              # Show short help'));
    console.log(chalk.white('  lanonasis --help       # Show detailed help'));
    console.log();
    console.log(chalk.yellow('API Key Usage (for AI agents):'));
    console.log(chalk.white('  npx -y @lanonasis/cli --api-key=<key> memory list'));
    console.log(chalk.white('  export LANONASIS_API_KEY=<key> && lanonasis memory search "query"'));
    console.log();
    console.log(chalk.gray('Documentation: https://docs.lanonasis.com/cli'));
  }
};

// Check if user is authenticated for protected commands
const requireAuth = (command: Command) => {
  command.hook('preAction', async (thisCommand) => {
    const opts = thisCommand.opts();
    const hasApiKey = opts.apiKey || process.env.LANONASIS_API_KEY;
    const isAuthenticated = await cliConfig.isAuthenticated();
    
    if (!isAuthenticated && !hasApiKey) {
      if (output.isJsonOutput()) {
        output.error('Authentication required');
      } else {
        console.error(chalk.red('✖ Authentication required'));
        console.log();
        console.log(chalk.yellow('Choose authentication method:'));
        console.log(chalk.white('  1. Interactive login:'), chalk.gray('lanonasis login'));
        console.log(chalk.white('  2. API Key:'), chalk.gray('lanonasis --api-key=<key> <command>'));
        console.log(chalk.white('  3. Environment:'), chalk.gray('export LANONASIS_API_KEY=<key>'));
        console.log();
      }
      process.exit(1);
    }
  });
};

// Initialize command (no auth required)
program
  .command('init')
  .description('Initialize CLI configuration')
  .option('-f, --force', 'overwrite existing configuration')
  .action(initCommand);

// Authentication commands (no auth required)
const authCmd = program
  .command('auth')
  .alias('login')
  .description('Authentication commands');

authCmd
  .command('login')
  .description('Login to your MaaS account')
  .option('-e, --email <email>', 'email address')
  .option('-p, --password <password>', 'password')
  .action(loginCommand);

authCmd
  .command('logout')
  .description('Logout from your account')
  .action(async () => {
    await cliConfig.logout();
    console.log(chalk.green('✓ Logged out successfully'));
  });

authCmd
  .command('status')
  .description('Show authentication status')
  .action(async () => {
    const isAuth = await cliConfig.isAuthenticated();
    const user = await cliConfig.getCurrentUser();
    
    if (isAuth && user) {
      console.log(chalk.green('✓ Authenticated'));
      console.log(`Email: ${user.email}`);
      console.log(`Organization: ${user.organization_id}`);
      console.log(`Plan: ${user.plan}`);
    } else {
      console.log(chalk.red('✖ Not authenticated'));
      console.log(chalk.yellow('Run:'), chalk.white('memory login'));
    }
  });

// MCP Commands (primary interface)
mcpCommands(program);

// Memory commands (require auth) - now MCP-powered by default
const memoryCmd = program
  .command('memory')
  .alias('mem')
  .description('Memory management commands');

requireAuth(memoryCmd);
memoryCommands(memoryCmd);

// Note: Memory commands are now MCP-powered when available

// Topic commands (require auth)
const topicCmd = program
  .command('topic')
  .alias('topics')
  .description('Topic management commands');

requireAuth(topicCmd);
topicCommands(topicCmd);

// Configuration commands (require auth)
const configCmd = program
  .command('config')
  .description('Configuration management');

requireAuth(configCmd);
configCommands(configCmd);

// Organization commands (require auth)
const orgCmd = program
  .command('org')
  .alias('organization')
  .description('Organization management');

requireAuth(orgCmd);
orgCommands(orgCmd);

// List connections and functions (prioritize memory services)
program
  .command('list')
  .alias('ls')
  .description('List available connections and functions')
  .option('--type <type>', 'filter by type (memory, api, mcp, all)', 'all')
  .action(async (options) => {
    const config = new CLIConfig();
    await config.init();
    
    const isAuth = await config.isAuthenticated();
    
    console.log(chalk.blue.bold('🔗 Available Connections & Functions'));
    console.log();
    
    if (!isAuth) {
      console.log(chalk.yellow('⚠️  Authentication required for full functionality'));
      console.log(chalk.gray('Run: lanonasis login'));
      console.log();
    }
    
    // Memory Services (Priority)
    if (options.type === 'all' || options.type === 'memory') {
      console.log(chalk.green.bold('🧠 Memory Services') + chalk.gray(' (Primary)'));
      console.log('  • Memory CRUD Operations');
      console.log('    - memory create    Create new memory entry');
      console.log('    - memory search    Semantic search memories');
      console.log('    - memory list      List all memories');
      console.log('    - memory get       Get specific memory');
      console.log('    - memory update    Update memory content');
      console.log('    - memory delete    Delete memory entry');
      console.log('  • Vector Embeddings & AI');
      console.log('    - Automatic embedding generation');
      console.log('    - Semantic similarity search');
      console.log('    - OpenAI text-embedding-ada-002');
      console.log('  • Organization & Topics');
      console.log('    - topic create     Create memory topics');
      console.log('    - topic list       List all topics');
      console.log('    - Memory type classification');
      console.log();
    }
    
    // API Connections
    if (options.type === 'all' || options.type === 'api') {
      console.log(chalk.blue.bold('🌐 API Connections'));
      console.log('  • Core Gateway API');
      console.log('    - https://api.lanonasis.com/v1');
      console.log('    - Authentication: JWT + API Keys');
      console.log('    - Project scope: maas');
      console.log('  • Supabase Backend');
      console.log('    - PostgreSQL + pgvector');
      console.log('    - Row Level Security (RLS)');
      console.log('    - Real-time subscriptions');
      console.log('  • OpenAI Integration');
      console.log('    - Embeddings generation');
      console.log('    - Text processing');
      console.log();
    }
    
    // MCP Tools
    if (options.type === 'all' || options.type === 'mcp') {
      console.log(chalk.magenta.bold('🤖 MCP (Model Context Protocol)'));
      console.log('  • AI Agent Interface');
      console.log('    - mcp start        Start MCP server');
      console.log('    - mcp status       Check MCP status');
      console.log('    - mcp connect      Connect to remote MCP');
      console.log('  • Tool Registry');
      console.log('    - Memory operations for AI agents');
      console.log('    - File system operations');
      console.log('    - External API integrations');
      console.log('  • Usage Examples');
      console.log('    - Claude Code integration');
      console.log('    - VS Code extensions');
      console.log('    - Cursor IDE support');
      console.log();
    }
    
    // Available Commands Summary
    console.log(chalk.yellow.bold('📋 Quick Command Reference'));
    console.log('  Authentication:');
    console.log('    lanonasis login              Interactive login');
    console.log('    lanonasis --api-key=<key>    API key authentication');
    console.log('  Memory (Primary):');
    console.log('    lanonasis memory create -t "Title" -c "Content"');
    console.log('    lanonasis memory search "query"');
    console.log('    lanonasis memory list --type project');
    console.log('  MCP for AI Agents:');
    console.log('    npx -y @lanonasis/cli --api-key=<key> memory list');
    console.log('    lanonasis mcp start');
    console.log();
    
    if (isAuth) {
      console.log(chalk.green('✓ All functions available (authenticated)'));
    } else {
      console.log(chalk.gray('ℹ️  Login for full access to memory services'));
    }
  });

// Global commands that don't require auth
program
  .command('status')
  .description('Show overall system status')
  .action(async () => {
    const isAuth = await cliConfig.isAuthenticated();
    const apiUrl = cliConfig.getApiUrl();
    
    console.log(chalk.blue.bold('MaaS CLI Status'));
    console.log(`API URL: ${apiUrl}`);
    console.log(`Authenticated: ${isAuth ? chalk.green('Yes') : chalk.red('No')}`);
    
    if (isAuth) {
      const user = await cliConfig.getCurrentUser();
      if (user) {
        console.log(`User: ${user.email}`);
        console.log(`Plan: ${user.plan}`);
      }
    }
  });

program
  .command('docs')
  .description('Open documentation in browser')
  .action(() => {
    const url = 'https://docs.lanonasis.com/cli';
    console.log(chalk.blue(`Opening documentation: ${url}`));
    
    // Try to open in browser
    import('open').then(open => {
      open.default(url).catch(() => {
        console.log(chalk.yellow('Could not open browser automatically.'));
        console.log(chalk.white(`Please visit: ${url}`));
      });
    }).catch(() => {
      console.log(chalk.white(`Please visit: ${url}`));
    });
  });

// Completion commands
program
  .command('completion')
  .description('Generate shell completion scripts')
  .option('--shell <shell>', 'shell type (bash, zsh)', 'bash')
  .action(async (options) => {
    const completions = new TabCompletions();
    
    switch (options.shell) {
      case 'bash':
        console.log(completions.generateBashCompletion());
        break;
      case 'zsh':
        console.log(completions.generateZshCompletion());
        break;
      default:
        console.error(chalk.red('Unsupported shell. Use: bash, zsh'));
        process.exit(1);
    }
  });

program
  .command('install-completion')
  .description('Install shell completions for current user')
  .option('--shell <shell>', 'shell type (bash, zsh)', 'bash')
  .action(async (options) => {
    const completions = new TabCompletions();
    const shell = options.shell;
    
    try {
      let completionScript: string;
      let installPath: string;
      
      switch (shell) {
        case 'bash':
          completionScript = completions.generateBashCompletion();
          installPath = `${process.env.HOME}/.bash_completion.d/lanonasis`;
          break;
        case 'zsh':
          completionScript = completions.generateZshCompletion();
          installPath = `${process.env.HOME}/.local/share/zsh/site-functions/_lanonasis`;
          break;
        default:
          console.error(chalk.red('Unsupported shell. Use: bash, zsh'));
          process.exit(1);
      }
      
      // Write completion script
      const { promises: fs } = await import('fs');
      const path = await import('path');
      
      await fs.mkdir(path.dirname(installPath), { recursive: true });
      await fs.writeFile(installPath, completionScript);
      
      console.log(chalk.green('✓ Shell completions installed'));
      console.log(`Location: ${installPath}`);
      console.log();
      console.log(chalk.yellow('To activate completions:'));
      
      switch (shell) {
        case 'bash':
          console.log(chalk.white('  source ~/.bash_completion.d/lanonasis'));
          console.log(chalk.gray('  # Or restart your terminal'));
          break;
        case 'zsh':
          console.log(chalk.white('  # Add to ~/.zshrc:'));
          console.log(chalk.white('  fpath=(~/.local/share/zsh/site-functions $fpath)'));
          console.log(chalk.white('  autoload -U compinit && compinit'));
          console.log(chalk.gray('  # Then restart your terminal'));
          break;
      }
      
    } catch (error) {
      console.error(chalk.red('✖ Failed to install completions:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Help customization
program.configureHelp({
  formatHelp: (cmd, helper) => {
    // Get terminal width for formatting (currently using default helper formatting)
    
    let help = chalk.blue.bold('🧠 Memory as a Service CLI\n\n');
    help += helper.commandUsage(cmd) + '\n\n';
    
    if (cmd.description()) {
      help += chalk.yellow('Description:\n');
      help += `  ${cmd.description()}\n\n`;
    }
    
    const commands = helper.visibleCommands(cmd);
    if (commands.length > 0) {
      help += chalk.yellow('Commands:\n');
      const maxNameLength = Math.max(...commands.map(c => c.name().length));
      commands.forEach(c => {
        const name = c.name().padEnd(maxNameLength);
        help += `  ${chalk.white(name)}  ${c.description()}\n`;
      });
      help += '\n';
    }
    
    const options = helper.visibleOptions(cmd);
    if (options.length > 0) {
      help += chalk.yellow('Options:\n');
      options.forEach(option => {
        help += `  ${option.flags.padEnd(20)}  ${option.description}\n`;
      });
      help += '\n';
    }
    
    help += chalk.gray('For more help on a specific command, run: memory <command> --help\n');
    help += chalk.gray('Documentation: https://docs.seyederick.com/memory-service\n');
    
    return help;
  }
});

// Parse CLI arguments
async function main() {
  // Show welcome message if no arguments provided
  if (process.argv.length <= 2) {
    showWelcome();
    return;
  }
  
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red('✖ Error:'), error.message);
      if (process.env.CLI_VERBOSE === 'true') {
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
}

main();