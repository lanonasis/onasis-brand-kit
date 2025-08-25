import chalk from 'chalk';

export interface OutputOptions {
  format?: string;
  silent?: boolean;
  json?: boolean;
}

export class OutputManager {
  private static instance: OutputManager;
  private options: OutputOptions = {};

  static getInstance(): OutputManager {
    if (!OutputManager.instance) {
      OutputManager.instance = new OutputManager();
    }
    return OutputManager.instance;
  }

  setOptions(options: OutputOptions): void {
    this.options = { ...this.options, ...options };
  }

  isJsonOutput(): boolean {
    return this.options.format === 'json' || 
           this.options.json === true || 
           process.env.CLI_OUTPUT_FORMAT === 'json';
  }

  isSilent(): boolean {
    return this.options.silent === true || 
           this.isJsonOutput() ||
           process.env.CLI_SILENT === 'true';
  }

  log(...args: any[]): void {
    if (!this.isSilent()) {
      console.log(...args);
    }
  }

  error(...args: any[]): void {
    if (this.isJsonOutput()) {
      console.error(JSON.stringify({
        error: true,
        message: args.join(' ').replace(/\x1b\[[0-9;]*m/g, '') // Strip ANSI codes
      }));
    } else {
      console.error(...args);
    }
  }

  json(data: any): void {
    console.log(JSON.stringify(data, null, 2));
  }

  table(data: any[]): void {
    if (this.isJsonOutput()) {
      this.json(data);
    } else {
      console.table(data);
    }
  }

  success(message: string): void {
    if (this.isJsonOutput()) {
      this.json({ success: true, message });
    } else {
      this.log(chalk.green('✓'), message);
    }
  }

  warning(message: string): void {
    if (this.isJsonOutput()) {
      this.json({ warning: true, message });
    } else {
      this.log(chalk.yellow('⚠️'), message);
    }
  }

  info(message: string): void {
    if (!this.isSilent()) {
      if (this.isJsonOutput()) {
        this.json({ info: true, message });
      } else {
        this.log(chalk.blue('ℹ'), message);
      }
    }
  }
}

export const output = OutputManager.getInstance();

// Helper to conditionally show output
export function showOutput(format?: string): boolean {
  return format !== 'json' && process.env.CLI_OUTPUT_FORMAT !== 'json';
}

// Helper to format output based on format
export function formatOutput(data: any, format?: string): string {
  const outputFormat = format || process.env.CLI_OUTPUT_FORMAT || 'table';
  
  switch (outputFormat) {
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'yaml':
      // Simple YAML-like format
      return Object.entries(data)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n');
    default:
      return data;
  }
}