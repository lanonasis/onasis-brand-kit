import chalk from 'chalk';
import { CLIConfig } from './config.js';

export interface CompletionData {
  commands: string[];
  memory: {
    types: string[];
    tags: string[];
    recentIds: string[];
  };
  topics: string[];
  organizations: string[];
}

export class TabCompletions {
  private config: CLIConfig;
  private completionData: CompletionData;

  constructor() {
    this.config = new CLIConfig();
    this.completionData = {
      commands: [
        'auth', 'login', 'logout', 'status',
        'memory', 'mem', 'create', 'search', 'list', 'get', 'update', 'delete',
        'topic', 'topics', 'org', 'organization',
        'config', 'mcp', 'init', 'docs', 'help'
      ],
      memory: {
        types: ['context', 'project', 'knowledge', 'reference', 'personal', 'workflow'],
        tags: [],
        recentIds: []
      },
      topics: [],
      organizations: []
    };
  }

  async init(): Promise<void> {
    await this.config.init();
    await this.loadDynamicCompletions();
  }

  private async loadDynamicCompletions(): Promise<void> {
    const isAuth = await this.config.isAuthenticated();
    if (!isAuth) return;

    try {
      // Load recent memory IDs, tags, topics from API
      // This would be enhanced with actual API calls
      await this.loadRecentMemories();
      await this.loadTopics();
      await this.loadTags();
    } catch (error) {
      // Fail silently for completions
      if (process.env.CLI_VERBOSE === 'true') {
        console.error(chalk.gray('Failed to load completions data'));
      }
    }
  }

  private async loadRecentMemories(): Promise<void> {
    // This would call the API to get recent memory IDs
    // For now, we'll use mock data
    this.completionData.memory.recentIds = [
      'mem_12345', 'mem_67890', 'mem_abcdef'
    ];
  }

  private async loadTopics(): Promise<void> {
    // This would call the API to get user's topics
    this.completionData.topics = [
      'work', 'personal', 'learning', 'projects'
    ];
  }

  private async loadTags(): Promise<void> {
    // This would call the API to get commonly used tags
    this.completionData.memory.tags = [
      'important', 'todo', 'reference', 'meeting', 'idea'
    ];
  }

  getCompletions(line: string, position: number): string[] {
    const words = line.trim().split(/\s+/);
    const currentWord = words[words.length - 1] || '';
    
    // If we're at the beginning or after a space, suggest commands
    if (words.length <= 1 || line.endsWith(' ')) {
      return this.completionData.commands.filter(cmd => 
        cmd.startsWith(currentWord.toLowerCase())
      );
    }

    const command = words[0];
    const subcommand = words[1];

    // Context-aware completions
    switch (command) {
      case 'memory':
      case 'mem':
        return this.getMemoryCompletions(words, currentWord);
      
      case 'topic':
      case 'topics':
        return this.getTopicCompletions(words, currentWord);
      
      case 'auth':
        return ['login', 'logout', 'status'].filter(cmd => 
          cmd.startsWith(currentWord)
        );
      
      case 'config':
        return ['show', 'set', 'get', 'reset'].filter(cmd => 
          cmd.startsWith(currentWord)
        );
      
      default:
        return [];
    }
  }

  private getMemoryCompletions(words: string[], currentWord: string): string[] {
    if (words.length === 2) {
      // Memory subcommands
      return ['create', 'search', 'list', 'get', 'update', 'delete', 'stats']
        .filter(cmd => cmd.startsWith(currentWord));
    }

    const subcommand = words[1];
    
    switch (subcommand) {
      case 'create':
        return this.getCreateCompletions(words, currentWord);
      
      case 'search':
        return this.getSearchCompletions(words, currentWord);
      
      case 'list':
        return this.getListCompletions(words, currentWord);
      
      case 'get':
      case 'update':
      case 'delete':
        return this.completionData.memory.recentIds.filter(id => 
          id.startsWith(currentWord)
        );
      
      default:
        return [];
    }
  }

  private getCreateCompletions(words: string[], currentWord: string): string[] {
    // Look for flags
    const prevWord = words[words.length - 2];
    
    if (prevWord === '--type' || prevWord === '-t') {
      return this.completionData.memory.types.filter(type => 
        type.startsWith(currentWord)
      );
    }
    
    if (prevWord === '--tags') {
      return this.completionData.memory.tags.filter(tag => 
        tag.startsWith(currentWord)
      );
    }

    // Suggest flags
    if (currentWord.startsWith('-')) {
      return ['--title', '--content', '--type', '--tags', '--topic']
        .filter(flag => flag.startsWith(currentWord));
    }

    return [];
  }

  private getSearchCompletions(words: string[], currentWord: string): string[] {
    const prevWord = words[words.length - 2];
    
    if (prevWord === '--type') {
      return this.completionData.memory.types.filter(type => 
        type.startsWith(currentWord)
      );
    }
    
    if (prevWord === '--topic') {
      return this.completionData.topics.filter(topic => 
        topic.startsWith(currentWord)
      );
    }

    if (currentWord.startsWith('-')) {
      return ['--limit', '--type', '--topic', '--tags']
        .filter(flag => flag.startsWith(currentWord));
    }

    return [];
  }

  private getListCompletions(words: string[], currentWord: string): string[] {
    const prevWord = words[words.length - 2];
    
    if (prevWord === '--type') {
      return this.completionData.memory.types.filter(type => 
        type.startsWith(currentWord)
      );
    }

    if (currentWord.startsWith('-')) {
      return ['--limit', '--type', '--topic', '--tags']
        .filter(flag => flag.startsWith(currentWord));
    }

    return [];
  }

  private getTopicCompletions(words: string[], currentWord: string): string[] {
    if (words.length === 2) {
      return ['list', 'create', 'get', 'update', 'delete']
        .filter(cmd => cmd.startsWith(currentWord));
    }

    const subcommand = words[1];
    
    if (['get', 'update', 'delete'].includes(subcommand)) {
      return this.completionData.topics.filter(topic => 
        topic.startsWith(currentWord)
      );
    }

    return [];
  }

  // Generate shell completion scripts
  generateBashCompletion(): string {
    return `
_lanonasis_completion() {
    local cur prev opts
    COMPREPLY=()
    cur="\${COMP_WORDS[COMP_CWORD]}"
    prev="\${COMP_WORDS[COMP_CWORD-1]}"
    
    # Basic command completion
    if [[ \${COMP_CWORD} == 1 ]] ; then
        opts="auth login logout status memory mem topic topics config mcp init docs help"
        COMPREPLY=( \$(compgen -W "\${opts}" -- \${cur}) )
        return 0
    fi
    
    # Memory subcommands
    if [[ \${COMP_WORDS[1]} == "memory" || \${COMP_WORDS[1]} == "mem" ]] ; then
        if [[ \${COMP_CWORD} == 2 ]] ; then
            opts="create search list get update delete stats"
            COMPREPLY=( \$(compgen -W "\${opts}" -- \${cur}) )
            return 0
        fi
    fi
    
    # Topic subcommands
    if [[ \${COMP_WORDS[1]} == "topic" || \${COMP_WORDS[1]} == "topics" ]] ; then
        if [[ \${COMP_CWORD} == 2 ]] ; then
            opts="list create get update delete"
            COMPREPLY=( \$(compgen -W "\${opts}" -- \${cur}) )
            return 0
        fi
    fi
}

complete -F _lanonasis_completion lanonasis onasis memory maas
`;
  }

  generateZshCompletion(): string {
    return `
#compdef lanonasis onasis memory maas

_lanonasis() {
    local context state line
    typeset -A opt_args

    _arguments -C \\
        '1: :_lanonasis_commands' \\
        '*::arg:->args'

    case $state in
        args)
            case $words[1] in
                memory|mem)
                    _lanonasis_memory
                    ;;
                topic|topics)
                    _lanonasis_topic
                    ;;
                auth)
                    _arguments \\
                        '1:(login logout status)'
                    ;;
            esac
            ;;
    esac
}

_lanonasis_commands() {
    local commands
    commands=(
        'auth:Authentication commands'
        'memory:Memory management'
        'topic:Topic management'
        'config:Configuration'
        'mcp:MCP server management'
        'init:Initialize CLI'
        'docs:Open documentation'
        'help:Show help'
    )
    _describe 'commands' commands
}

_lanonasis_memory() {
    local subcommands
    subcommands=(
        'create:Create new memory'
        'search:Search memories'
        'list:List memories'
        'get:Get specific memory'
        'update:Update memory'
        'delete:Delete memory'
        'stats:Memory statistics'
    )
    _describe 'memory commands' subcommands
}

_lanonasis_topic() {
    local subcommands
    subcommands=(
        'list:List topics'
        'create:Create topic'
        'get:Get topic'
        'update:Update topic'
        'delete:Delete topic'
    )
    _describe 'topic commands' subcommands
}

_lanonasis
`;
  }
}