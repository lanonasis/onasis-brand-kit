/**
 * Admin Service for Gateway Management
 * Provides elevated controls for payment gateway administration
 */

import { paymentGatewayService } from './paymentGatewayService';

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'support';
  permissions: string[];
  lastLogin?: string;
}

export interface GatewayConfig {
  id: string;
  name: string;
  enabled: boolean;
  testMode: boolean;
  priority: number; // For smart routing preference
  apiKeys: {
    test: {
      publicKey?: string;
      secretKey?: string;
      configured: boolean;
    };
    live: {
      publicKey?: string;
      secretKey?: string;
      configured: boolean;
    };
  };
  settings: {
    minAmount?: number;
    maxAmount?: number;
    supportedCurrencies: string[];
    supportedCountries: string[];
    fees: {
      percentage: number;
      fixed: number;
      currency: string;
    };
  };
  status: {
    operational: boolean;
    lastChecked: string;
    uptime: string;
    errorRate: number;
  };
}

export interface AdminTestResult {
  gateway: string;
  success: boolean;
  responseTime: number;
  transactionId?: string;
  error?: string;
  details: any;
  timestamp: string;
}

export interface EscalationTicket {
  id: string;
  gateway: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  createdAt: string;
  assignedTo?: string;
  notes: string[];
}

export interface MonitoringMetrics {
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
  activeGateways: number;
  avgResponseTime: number;
  failedTransactions: number;
  gatewayHealth: {
    gateway: string;
    status: 'online' | 'offline' | 'degraded';
    uptime: string;
    responseTime: number;
    successRate: number;
    lastTransaction: string;
  }[];
  hourlyVolume: number[];
  recentAlerts: {
    id: string;
    type: 'error' | 'warning' | 'info';
    message: string;
    timestamp: string;
    gateway?: string;
  }[];
}

export interface MCPServer {
  id: string;
  name: string;
  type: 'local' | 'remote' | 'cloud';
  status: 'connected' | 'disconnected' | 'error';
  version: string;
  capabilities: string[];
  config: {
    endpoint?: string;
    apiKey?: string;
    model?: string;
    maxTokens?: number;
  };
  stats: {
    totalRequests: number;
    avgResponseTime: number;
    errorRate: number;
    lastUsed: string;
  };
  enabled: boolean;
}

export interface MCPIntegration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'payment' | 'database' | 'api' | 'utility' | 'ai';
  status: 'active' | 'inactive' | 'pending';
  requiredPermissions: string[];
}

export interface MCPData {
  servers: MCPServer[];
  integrations: MCPIntegration[];
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  category: 'ai' | 'payment' | 'ui' | 'security' | 'integration';
  status: 'coming_soon' | 'beta' | 'enabled' | 'disabled';
  releaseDate?: string;
  enabled: boolean;
  permissions: string[];
  dependencies?: string[];
}

class AdminService {
  private baseUrl: string;
  private adminApiKey: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_ONASIS_GATEWAY_URL || 'http://localhost:3000';
    this.adminApiKey = import.meta.env.VITE_ADMIN_API_KEY || '';
  }

  /**
   * Check if current user has admin access
   */
  async isAdmin(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${this.adminApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Admin verification failed:', error);
      return false;
    }
  }

  /**
   * Get admin user profile
   */
  async getAdminProfile(): Promise<AdminUser | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/profile`, {
        headers: {
          'Authorization': `Bearer ${this.adminApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to get admin profile:', error);
    }

    // Mock admin user for development
    return {
      id: 'admin_1',
      email: 'admin@vortexcore.app',
      role: 'super_admin',
      permissions: ['gateway_management', 'testing', 'troubleshooting', 'escalation'],
      lastLogin: new Date().toISOString()
    };
  }

  /**
   * Get all gateway configurations
   */
  async getGatewayConfigs(): Promise<GatewayConfig[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/gateways`, {
        headers: {
          'Authorization': `Bearer ${this.adminApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.gateways || [];
      }
    } catch (error) {
      console.error('Failed to fetch gateway configs:', error);
    }

    // Mock configurations with live key status
    return [
      {
        id: 'stripe',
        name: 'Stripe',
        enabled: true,
        testMode: false,
        priority: 1,
        apiKeys: {
          test: { configured: true, publicKey: 'pk_test_***', secretKey: 'sk_test_***' },
          live: { configured: true, publicKey: 'pk_live_***', secretKey: 'sk_live_***' }
        },
        settings: {
          minAmount: 50,
          maxAmount: 1000000,
          supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD'],
          supportedCountries: ['US', 'GB', 'CA', 'AU', 'DE', 'FR'],
          fees: { percentage: 2.9, fixed: 30, currency: 'USD' }
        },
        status: {
          operational: true,
          lastChecked: new Date().toISOString(),
          uptime: '99.98%',
          errorRate: 0.02
        }
      },
      {
        id: 'paystack',
        name: 'Paystack',
        enabled: true,
        testMode: false,
        priority: 2,
        apiKeys: {
          test: { configured: true, publicKey: 'pk_test_***', secretKey: 'sk_test_***' },
          live: { configured: true, publicKey: 'pk_live_***', secretKey: 'sk_live_***' }
        },
        settings: {
          minAmount: 100,
          maxAmount: 1000000,
          supportedCurrencies: ['NGN', 'GHS', 'ZAR', 'KES'],
          supportedCountries: ['NG', 'GH', 'ZA', 'KE'],
          fees: { percentage: 1.5, fixed: 100, currency: 'NGN' }
        },
        status: {
          operational: true,
          lastChecked: new Date().toISOString(),
          uptime: '99.95%',
          errorRate: 0.05
        }
      },
      {
        id: 'sayswitch',
        name: 'SaySwitch',
        enabled: true,
        testMode: true,
        priority: 3,
        apiKeys: {
          test: { configured: true, publicKey: 'ss_test_***', secretKey: 'ss_test_***' },
          live: { configured: true, publicKey: 'ss_live_***', secretKey: 'ss_live_***' }
        },
        settings: {
          minAmount: 1000,
          maxAmount: 5000000,
          supportedCurrencies: ['NGN'],
          supportedCountries: ['NG'],
          fees: { percentage: 1.0, fixed: 50, currency: 'NGN' }
        },
        status: {
          operational: true,
          lastChecked: new Date().toISOString(),
          uptime: '99.92%',
          errorRate: 0.08
        }
      },
      {
        id: 'flutterwave',
        name: 'Flutterwave',
        enabled: false,
        testMode: true,
        priority: 4,
        apiKeys: {
          test: { configured: false },
          live: { configured: false }
        },
        settings: {
          minAmount: 100,
          maxAmount: 1000000,
          supportedCurrencies: ['NGN', 'USD', 'EUR', 'GBP', 'GHS'],
          supportedCountries: ['NG', 'GH', 'KE', 'UG', 'ZA', 'TZ'],
          fees: { percentage: 1.4, fixed: 0, currency: 'NGN' }
        },
        status: {
          operational: false,
          lastChecked: new Date().toISOString(),
          uptime: '0%',
          errorRate: 100
        }
      }
    ];
  }

  /**
   * Update gateway configuration
   */
  async updateGatewayConfig(gatewayId: string, config: Partial<GatewayConfig>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/gateways/${gatewayId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.adminApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to update gateway config:', error);
      return false;
    }
  }

  /**
   * Test gateway with live/test keys
   */
  async testGateway(gatewayId: string, useTestKeys: boolean = true): Promise<AdminTestResult> {
    const startTime = Date.now();
    
    try {
      const testPayment = {
        amount: 100, // $1.00 or ₦100
        currency: gatewayId === 'paystack' || gatewayId === 'sayswitch' ? 'NGN' : 'USD',
        customer: {
          email: 'admin.test@vortexcore.app',
          name: 'Admin Test User'
        },
        gateway: gatewayId,
        metadata: {
          admin_test: true,
          test_keys: useTestKeys,
          timestamp: new Date().toISOString()
        }
      };

      const response = await paymentGatewayService.initializePayment(testPayment);
      const responseTime = Date.now() - startTime;

      return {
        gateway: gatewayId,
        success: response.success,
        responseTime,
        transactionId: response.transactionId,
        error: response.error,
        details: response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        gateway: gatewayId,
        success: false,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Run health check on all gateways
   */
  async runHealthCheck(): Promise<AdminTestResult[]> {
    const gateways = await this.getGatewayConfigs();
    const enabledGateways = gateways.filter(g => g.enabled);
    
    const healthChecks = enabledGateways.map(gateway => 
      this.testGateway(gateway.id, true) // Use test keys for health check
    );

    return Promise.all(healthChecks);
  }

  /**
   * Get escalation tickets
   */
  async getEscalationTickets(): Promise<EscalationTicket[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/escalations`, {
        headers: {
          'Authorization': `Bearer ${this.adminApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.tickets || [];
      }
    } catch (error) {
      console.error('Failed to fetch escalation tickets:', error);
    }

    // Mock escalation tickets
    return [
      {
        id: 'esc_001',
        gateway: 'paystack',
        issue: 'High error rate on card transactions',
        severity: 'high',
        status: 'investigating',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'admin@vortexcore.app',
        notes: [
          'Investigating increased error rate',
          'Contacted Paystack support',
          'Monitoring for resolution'
        ]
      },
      {
        id: 'esc_002',
        gateway: 'sayswitch',
        issue: 'Webhook delays causing timeout',
        severity: 'medium',
        status: 'open',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        notes: [
          'Users reporting payment confirmation delays',
          'Webhook response times > 30s'
        ]
      }
    ];
  }

  /**
   * Create escalation ticket
   */
  async createEscalation(escalation: Omit<EscalationTicket, 'id' | 'createdAt' | 'notes'>): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/escalations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.adminApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(escalation)
      });

      if (response.ok) {
        const data = await response.json();
        return data.id;
      }
    } catch (error) {
      console.error('Failed to create escalation:', error);
    }

    return `esc_${Date.now()}`;
  }

  /**
   * Get monitoring metrics for admin dashboard
   */
  async getMonitoringMetrics(): Promise<MonitoringMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/monitoring`, {
        headers: {
          'Authorization': `Bearer ${this.adminApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch monitoring metrics:', error);
    }

    // Mock monitoring data
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    return {
      totalTransactions: 15847,
      totalVolume: 2345600000, // ₦2.3M
      successRate: 98.7,
      activeGateways: 3,
      avgResponseTime: 235,
      failedTransactions: 206,
      gatewayHealth: [
        {
          gateway: 'stripe',
          status: 'online',
          uptime: '99.98%',
          responseTime: 180,
          successRate: 99.2,
          lastTransaction: '2 minutes ago'
        },
        {
          gateway: 'paystack',
          status: 'online',
          uptime: '99.95%',
          responseTime: 220,
          successRate: 98.8,
          lastTransaction: '1 minute ago'
        },
        {
          gateway: 'sayswitch',
          status: 'degraded',
          uptime: '97.2%',
          responseTime: 850,
          successRate: 96.1,
          lastTransaction: '15 minutes ago'
        },
        {
          gateway: 'flutterwave',
          status: 'offline',
          uptime: '0%',
          responseTime: 0,
          successRate: 0,
          lastTransaction: 'Never'
        }
      ],
      hourlyVolume: [120000, 145000, 132000, 167000, 189000, 234000, 198000, 156000],
      recentAlerts: [
        {
          id: 'alert_001',
          type: 'warning',
          message: 'SaySwitch response time elevated (>500ms)',
          timestamp: oneHourAgo.toLocaleTimeString(),
          gateway: 'sayswitch'
        },
        {
          id: 'alert_002',
          type: 'info',
          message: 'Daily transaction volume reached 75% of limit',
          timestamp: twoHoursAgo.toLocaleTimeString()
        },
        {
          id: 'alert_003',
          type: 'error',
          message: 'Flutterwave gateway offline - disabled from routing',
          timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toLocaleTimeString(),
          gateway: 'flutterwave'
        }
      ]
    };
  }

  /**
   * Get MCP servers and integrations
   */
  async getMCPServers(): Promise<MCPData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/mcp`, {
        headers: {
          'Authorization': `Bearer ${this.adminApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch MCP data:', error);
    }

    // Mock MCP data
    return {
      servers: [
        {
          id: 'claude-mcp',
          name: 'Claude MCP Server',
          type: 'cloud',
          status: 'connected',
          version: '1.2.3',
          capabilities: ['chat', 'code-generation', 'analysis', 'planning'],
          config: {
            endpoint: 'https://api.anthropic.com/v1/mcp',
            model: 'claude-3-sonnet',
            maxTokens: 4096
          },
          stats: {
            totalRequests: 15847,
            avgResponseTime: 892,
            errorRate: 0.2,
            lastUsed: '2 minutes ago'
          },
          enabled: true
        },
        {
          id: 'onasis-gateway',
          name: 'Onasis Gateway MCP',
          type: 'local',
          status: 'connected',
          version: '2.1.0',
          capabilities: ['payment-processing', 'gateway-routing', 'webhook-handling'],
          config: {
            endpoint: 'http://localhost:3001/mcp',
            apiKey: 'og_***'
          },
          stats: {
            totalRequests: 8943,
            avgResponseTime: 245,
            errorRate: 0.1,
            lastUsed: '30 seconds ago'
          },
          enabled: true
        },
        {
          id: 'pica-integration',
          name: 'Pica Integration Server',
          type: 'remote',
          status: 'connected',
          version: '1.8.5',
          capabilities: ['api-integrations', 'data-sync', 'automation'],
          config: {
            endpoint: 'https://pica.onasis.dev/mcp',
            apiKey: 'pica_***'
          },
          stats: {
            totalRequests: 3421,
            avgResponseTime: 567,
            errorRate: 0.5,
            lastUsed: '5 minutes ago'
          },
          enabled: true
        },
        {
          id: 'context7-docs',
          name: 'Context7 Documentation',
          type: 'cloud',
          status: 'connected',
          version: '3.0.1',
          capabilities: ['documentation', 'code-examples', 'api-reference'],
          config: {
            endpoint: 'https://context7.dev/mcp',
            apiKey: 'ctx7_***'
          },
          stats: {
            totalRequests: 1234,
            avgResponseTime: 423,
            errorRate: 0.0,
            lastUsed: '1 hour ago'
          },
          enabled: true
        },
        {
          id: 'sequential-thinking',
          name: 'Sequential Thinking MCP',
          type: 'local',
          status: 'disconnected',
          version: '1.0.0',
          capabilities: ['problem-solving', 'step-planning', 'analysis'],
          config: {
            endpoint: 'http://localhost:3002/mcp'
          },
          stats: {
            totalRequests: 0,
            avgResponseTime: 0,
            errorRate: 0,
            lastUsed: 'Never'
          },
          enabled: false
        }
      ],
      integrations: [
        {
          id: 'paystack-mcp',
          name: 'Paystack Integration',
          description: 'Direct Paystack API integration via MCP',
          icon: 'credit-card',
          category: 'payment',
          status: 'active',
          requiredPermissions: ['payment.read', 'payment.write']
        },
        {
          id: 'sayswitch-mcp',
          name: 'SaySwitch Integration',
          description: 'SaySwitch payment processing integration',
          icon: 'zap',
          category: 'payment',
          status: 'active',
          requiredPermissions: ['payment.read', 'payment.write']
        },
        {
          id: 'supabase-mcp',
          name: 'Supabase Database',
          description: 'Real-time database operations via MCP',
          icon: 'database',
          category: 'database',
          status: 'active',
          requiredPermissions: ['db.read', 'db.write', 'auth.manage']
        },
        {
          id: 'claude-code-mcp',
          name: 'Claude Code Integration',
          description: 'Enhanced code generation and analysis',
          icon: 'code',
          category: 'ai',
          status: 'active',
          requiredPermissions: ['ai.generate', 'code.analyze']
        },
        {
          id: 'webhook-handler',
          name: 'Webhook Handler',
          description: 'Automated webhook processing and routing',
          icon: 'globe',
          category: 'api',
          status: 'active',
          requiredPermissions: ['webhook.receive', 'webhook.process']
        },
        {
          id: 'log-analyzer',
          name: 'Log Analyzer',
          description: 'Automated log analysis and alerting',
          icon: 'activity',
          category: 'utility',
          status: 'pending',
          requiredPermissions: ['logs.read', 'alerts.create']
        }
      ]
    };
  }

  /**
   * Update MCP server configuration
   */
  async updateMCPServer(serverId: string, config: Partial<MCPServer>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/mcp/${serverId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.adminApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to update MCP server:', error);
      return false;
    }
  }

  /**
   * Restart MCP server
   */
  async restartMCPServer(serverId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/mcp/${serverId}/restart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.adminApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to restart MCP server:', error);
      return false;
    }
  }

  /**
   * Check if email is pre-approved admin
   */
  isPreApprovedAdmin(email: string): boolean {
    const preApprovedEmails = [
      'info@lanonasis.com',
      'info@seftechub.com',
      'thelanonasis@gmail.com'
    ];
    return preApprovedEmails.includes(email.toLowerCase());
  }

  /**
   * Get admin permissions based on email
   */
  getAdminPermissions(email: string): string[] {
    if (this.isPreApprovedAdmin(email)) {
      return [
        'gateway_management',
        'mcp_management', 
        'testing',
        'troubleshooting',
        'escalation',
        'monitoring',
        'user_management',
        'system_configuration'
      ];
    }
    return [];
  }

  /**
   * Get feature flags
   */
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/features`, {
        headers: {
          'Authorization': `Bearer ${this.adminApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch feature flags:', error);
    }

    // Mock feature flags
    return [
      {
        id: 'vortex-ai-assistant',
        name: 'VortexAI Assistant',
        description: 'AI-powered assistant to guide and help with any task within the interface',
        category: 'ai',
        status: 'coming_soon',
        releaseDate: 'Q1 2025',
        enabled: false,
        permissions: ['ai.chat', 'admin.assist', 'workflow.guide'],
        dependencies: ['claude-mcp', 'onasis-gateway']
      },
      {
        id: 'advanced-analytics',
        name: 'Advanced Analytics Dashboard',
        description: 'Enhanced analytics with predictive insights and custom reporting',
        category: 'ui',
        status: 'beta',
        releaseDate: 'December 2024',
        enabled: false,
        permissions: ['analytics.view', 'reports.generate']
      },
      {
        id: 'multi-currency-routing',
        name: 'Multi-Currency Smart Routing',
        description: 'Intelligent routing based on exchange rates and fees across currencies',
        category: 'payment',
        status: 'beta',
        enabled: true,
        permissions: ['payment.route', 'currency.manage']
      },
      {
        id: 'webhook-builder',
        name: 'Visual Webhook Builder',
        description: 'Drag-and-drop interface for building custom webhook handlers',
        category: 'integration',
        status: 'coming_soon',
        releaseDate: 'Q2 2025',
        enabled: false,
        permissions: ['webhook.build', 'integration.manage']
      },
      {
        id: 'fraud-detection-ai',
        name: 'AI Fraud Detection',
        description: 'Machine learning-powered fraud detection and prevention',
        category: 'security',
        status: 'coming_soon',
        releaseDate: 'Q1 2025',
        enabled: false,
        permissions: ['security.monitor', 'fraud.detect'],
        dependencies: ['advanced-analytics']
      },
      {
        id: 'real-time-notifications',
        name: 'Real-time Notifications',
        description: 'Push notifications for critical events and system alerts',
        category: 'ui',
        status: 'enabled',
        enabled: true,
        permissions: ['notifications.send', 'alerts.manage']
      }
    ];
  }

  /**
   * Update feature flag
   */
  async updateFeatureFlag(featureId: string, config: Partial<FeatureFlag>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/features/${featureId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.adminApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to update feature flag:', error);
      return false;
    }
  }
}

export const adminService = new AdminService();
export default adminService;