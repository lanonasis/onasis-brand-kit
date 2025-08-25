#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import clipboardy from 'clipboardy';

interface L0Response {
  message: string;
  code?: string;
  data?: any;
  related?: string[];
  clipboard?: boolean;
  dashboardUrl?: string;
  type: 'snippet' | 'memory' | 'context' | 'help' | 'suggestion';
}

// Mock L0 Agent for testing (no auth required)
class L0Agent {
  private mockDatabase = {
    snippets: [
      {
        id: 'floating-card-1',
        title: 'Floating Black Card Component',
        content: `<div className="fixed bottom-4 right-4 bg-black rounded-lg shadow-xl p-4 text-white max-w-sm animate-fade-in">
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 bg-blue-500 rounded-full" />
    <div>
      <h3 className="font-medium">Notification</h3>
      <p className="text-sm opacity-75">{message}</p>
    </div>
  </div>
</div>`,
        language: 'react',
        tags: ['ui', 'floating', 'notification', 'card'],
        lastUsed: '2 days ago',
        project: 'dashboard-redesign'
      },
      {
        id: 'auth-middleware-1',
        title: 'JWT Token Validation Middleware',
        content: `const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET=REDACTED_JWT_SECRET
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};`,
        language: 'javascript',
        tags: ['auth', 'middleware', 'jwt', 'security'],
        lastUsed: '1 week ago',
        project: 'api-gateway'
      },
      {
        id: 'modal-dialog-1',
        title: 'Accessible Modal Dialog',
        content: `const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};`,
        language: 'react',
        tags: ['modal', 'dialog', 'accessibility', 'ui'],
        lastUsed: '3 days ago',
        project: 'component-library'
      }
    ],
    memories: [
      {
        id: 'meeting-notes-1',
        title: 'Team Standup - Auth Integration',
        content: 'Discussed Core Gateway integration for MaaS dashboard. Need to implement OAuth callback handling and session management. Priority: High',
        type: 'meeting',
        date: 'yesterday',
        tags: ['auth', 'core-gateway', 'oauth']
      },
      {
        id: 'api-patterns-1',
        title: 'REST API Design Patterns',
        content: 'Best practices: Use consistent error responses, implement proper pagination, add rate limiting, use semantic HTTP status codes',
        type: 'reference',
        date: '1 week ago',
        tags: ['api', 'patterns', 'rest', 'best-practices']
      }
    ]
  };

  async query(query: string, context?: any): Promise<L0Response> {
    const lowerQuery = query.toLowerCase();

    // Handle code snippet requests
    if (lowerQuery.includes('code') || lowerQuery.includes('snippet')) {
      return this.findCode(query);
    }

    // Handle memory searches
    if (lowerQuery.includes('memory') || lowerQuery.includes('notes') || lowerQuery.includes('meeting')) {
      return this.searchMemories(query);
    }

    // Handle help requests
    if (lowerQuery.includes('help') || lowerQuery.includes('how to')) {
      return this.getHelp(query);
    }

    // Default response
    return {
      message: `I understand you're asking about: "${query}". I can help you find code snippets, search memories, or provide assistance. Try being more specific!`,
      type: 'help',
      related: ['lanonasis l0 code "component name"', 'lanonasis l0 memory "search term"', 'lanonasis l0 help "topic"']
    };
  }

  async findCode(description: string): Promise<L0Response> {
    const keywords = description.toLowerCase().split(' ');
    const matches = this.mockDatabase.snippets.filter(snippet => 
      keywords.some(keyword => 
        snippet.title.toLowerCase().includes(keyword) ||
        snippet.tags.some(tag => tag.includes(keyword)) ||
        snippet.content.toLowerCase().includes(keyword)
      )
    );

    if (matches.length === 0) {
      return {
        message: `No code snippets found for "${description}". Try different keywords!`,
        type: 'snippet',
        related: ['floating card', 'modal dialog', 'auth middleware']
      };
    }

    const bestMatch = matches[0];
    
    return {
      message: `Found ${matches.length} matching snippet${matches.length > 1 ? 's' : ''}:`,
      code: bestMatch.content,
      data: {
        title: bestMatch.title,
        language: bestMatch.language,
        lastUsed: bestMatch.lastUsed,
        project: bestMatch.project,
        tags: bestMatch.tags
      },
      type: 'snippet',
      clipboard: true,
      dashboardUrl: `/memories/${bestMatch.id}`,
      related: matches.slice(1, 3).map(m => m.title)
    };
  }

  async searchMemories(query: string): Promise<L0Response> {
    const keywords = query.toLowerCase().split(' ');
    const matches = this.mockDatabase.memories.filter(memory =>
      keywords.some(keyword =>
        memory.title.toLowerCase().includes(keyword) ||
        memory.content.toLowerCase().includes(keyword) ||
        memory.tags.some(tag => tag.includes(keyword))
      )
    );

    if (matches.length === 0) {
      return {
        message: `No memories found for "${query}". Your memory bank is growing!`,
        type: 'memory',
        related: ['meeting notes', 'api patterns', 'project references']
      };
    }

    const results = matches.map(m => `${m.title}: ${m.content.substring(0, 100)}...`).join('\n\n');

    return {
      message: `Found ${matches.length} relevant memories:`,
      data: results,
      type: 'memory',
      dashboardUrl: `/memories?q=${encodeURIComponent(query)}`,
      related: matches.slice(0, 3).map(m => m.title)
    };
  }

  async getHelp(query: string): Promise<L0Response> {
    const helpTopics = {
      'oauth': 'OAuth implementation: Use authorization code flow, store tokens securely, implement refresh logic',
      'authentication': 'Auth best practices: JWT tokens, secure storage, session management, logout handling',
      'components': 'React components: Use composition, implement proper props, handle edge cases, add accessibility',
      'api': 'API design: RESTful endpoints, proper status codes, error handling, documentation'
    };

    const topic = Object.keys(helpTopics).find(t => query.toLowerCase().includes(t));
    
    if (topic) {
      return {
        message: helpTopics[topic],
        type: 'help',
        related: Object.keys(helpTopics).filter(t => t !== topic)
      };
    }

    return {
      message: 'I can help with: OAuth, authentication, React components, API design, and more. What specific topic interests you?',
      type: 'help',
      related: Object.keys(helpTopics)
    };
  }
}

const l0Agent = new L0Agent();

// Enhanced display functions
function displayL0Response(response: L0Response) {
  console.log('\n' + chalk.blue.bold('🧠 L0:'), response.message);
  
  if (response.code) {
    const boxContent = response.code;
    const title = response.data?.title || 'Code Snippet';
    
    console.log(boxen(boxContent, {
      title: chalk.yellow(`📝 ${title}`),
      padding: 1,
      borderColor: 'yellow',
      borderStyle: 'round',
      width: Math.min(80, Math.max(50, boxContent.split('\n').reduce((max, line) => Math.max(max, line.length), 0) + 4))
    }));

    if (response.data) {
      console.log(chalk.gray(`Last used: ${response.data.lastUsed} | Project: ${response.data.project}`));
      console.log(chalk.cyan(`Tags: ${response.data.tags.join(', ')}`));
    }

    if (response.clipboard) {
      try {
        clipboardy.writeSync(response.code);
        console.log(chalk.green('📋 Copied to clipboard'));
      } catch {
        console.log(chalk.yellow('📋 Copy to clipboard failed'));
      }
    }
  }
  
  if (response.data && !response.code) {
    console.log(boxen(response.data, {
      padding: 1,
      borderColor: 'green',
      borderStyle: 'round'
    }));
  }
  
  if (response.related && response.related.length > 0) {
    console.log(chalk.gray('✨ Related:'), 
      response.related.map(r => chalk.cyan(r)).join(', ')
    );
  }
  
  if (response.dashboardUrl) {
    console.log(chalk.gray(`🔗 View in dashboard: https://dashboard.lanonasis.com${response.dashboardUrl}`));
  }
  
  console.log(''); // Empty line for spacing
}

// VortexAI L0 Commands - Universal Work Orchestrator
export const l0Commands = (program: Command) => {
  const l0Cmd = program
    .command('l0')
    .alias('vortex')
    .alias('orchestrate')
    .description(chalk.magenta.bold('🌪️  VortexAI L0 - Universal Work Orchestrator'))
    .action(() => {
      console.log(chalk.magenta.bold('\n🌪️  VortexAI L0 - Universal Work Orchestrator'));
      console.log(chalk.gray('═'.repeat(50)));
      console.log('\n🎯 L0 orchestrates your entire workflow:');
      console.log(chalk.cyan('  • Social media campaigns & content creation'));
      console.log(chalk.cyan('  • Code snippets and development workflows'));  
      console.log(chalk.cyan('  • Data analysis and report generation'));
      console.log(chalk.cyan('  • Multi-agent task orchestration'));
      console.log('\n🚀 Real-world commands:');
      console.log(chalk.yellow('  vortex l0 "create social media campaign for product launch"'));
      console.log(chalk.yellow('  vortex l0 "analyze trending topics and create content"'));
      console.log(chalk.yellow('  vortex l0 code "floating notification component"'));
      console.log(chalk.yellow('  vortex l0 "research competitors and update strategy"'));
      console.log('\n💡 L0 doesn\'t just answer. L0 acts.');
      console.log('');
    });

  l0Cmd
    .command('ask <query>')
    .description('Ask L0 anything from your context')
    .option('-p, --project <name>', 'scope to specific project')
    .option('-f, --format <type>', 'output format (text, json, code)', 'text')
    .action(async (query, options) => {
      try {
        const response = await l0Agent.query(query, options);
        if (options.format === 'json') {
          console.log(JSON.stringify(response, null, 2));
        } else {
          displayL0Response(response);
        }
      } catch (error) {
        console.error(chalk.red('❌ L0 Error:'), error instanceof Error ? error.message : String(error));
      }
    });

  l0Cmd
    .command('code <description>')
    .description('Get code snippets from L0 memory')
    .option('-l, --language <lang>', 'filter by language')
    .option('--copy', 'copy to clipboard automatically', true)
    .action(async (description, options) => {
      try {
        const response = await l0Agent.findCode(description);
        displayL0Response(response);
      } catch (error) {
        console.error(chalk.red('❌ Code search failed:'), error instanceof Error ? error.message : String(error));
      }
    });

  l0Cmd
    .command('memory <query>')
    .description('Search your organized memories')
    .option('--type <type>', 'memory type filter')
    .option('-l, --limit <limit>', 'number of results', '5')
    .action(async (query, options) => {
      try {
        const response = await l0Agent.searchMemories(query);
        displayL0Response(response);
      } catch (error) {
        console.error(chalk.red('❌ Memory search failed:'), error instanceof Error ? error.message : String(error));
      }
    });

  l0Cmd
    .command('help <topic>')
    .description('Get help and guidance from L0')
    .action(async (topic) => {
      try {
        const response = await l0Agent.getHelp(topic);
        displayL0Response(response);
      } catch (error) {
        console.error(chalk.red('❌ Help request failed:'), error instanceof Error ? error.message : String(error));
      }
    });
};

export default l0Commands;