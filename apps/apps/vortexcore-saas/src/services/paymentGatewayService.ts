/**
 * Unified Payment Gateway Service
 * Connects VortexCore-SaaS frontend to Onasis-Gateway backend APIs
 */

export interface PaymentGateway {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: 'active' | 'inactive' | 'maintenance';
  capabilities: string[];
  supportedCountries: string[];
  supportedCurrencies: string[];
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  gateway?: string;
  customer: {
    email: string;
    name: string;
    phone?: string;
    country?: string; // For smart routing
  };
  metadata?: Record<string, any>;
  redirectUrl?: string;
  webhookUrl?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  reference: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  gateway: string;
  paymentUrl?: string;
  message?: string;
  error?: string;
}

export interface TransactionDetails {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  customer: {
    email: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

class PaymentGatewayService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    // Use environment variables or default to local development
    this.baseUrl = import.meta.env.VITE_ONASIS_GATEWAY_URL || 'http://localhost:3000';
    this.apiKey = import.meta.env.VITE_ONASIS_API_KEY || '';
  }

  /**
   * Smart gateway routing logic
   * - Local African countries: Paystack, Flutterwave, SaySwitch
   * - International: Stripe, PayPal, Wise
   */
  private selectOptimalGateway(request: PaymentRequest): string {
    const { currency, customer, amount } = request;
    const country = customer.country?.toUpperCase();

    // African local currencies and countries
    const africanCurrencies = ['NGN', 'GHS', 'KES', 'ZAR', 'UGX', 'TZS'];
    const africanCountries = ['NG', 'GH', 'KE', 'ZA', 'UG', 'TZ'];

    // Local African routing
    if (africanCurrencies.includes(currency) || (country && africanCountries.includes(country))) {
      // For Nigerian transactions, prefer Paystack or SaySwitch
      if (currency === 'NGN' || country === 'NG') {
        return amount >= 50000 ? 'sayswitch' : 'paystack'; // SaySwitch for larger amounts (₦500+)
      }
      
      // For other African countries, use Flutterwave (wider coverage)
      if (['GH', 'KE', 'UG', 'TZ'].includes(country || '')) {
        return 'flutterwave';
      }
      
      // Default to Paystack for African currencies
      return 'paystack';
    }

    // International routing
    // High-value transactions or business accounts
    if (amount >= 100000) { // $1000+
      return 'stripe'; // Better for high-value transactions
    }

    // Multi-currency or cross-border
    if (['EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'SGD'].includes(currency)) {
      return 'wise'; // Best rates for international currencies
    }

    // Default international gateway
    return 'stripe'; // Most reliable for USD and general international
  }

  /**
   * Auto-detect customer country from browser/IP (optional enhancement)
   */
  private async detectCustomerCountry(): Promise<string | null> {
    try {
      // Use a geolocation API to detect country (optional)
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        return data.country_code;
      }
    } catch (error) {
      console.warn('Could not detect customer country:', error);
    }
    return null;
  }

  /**
   * Get all available payment gateways
   */
  async getAvailableGateways(): Promise<PaymentGateway[]> {
    const defaultGateways: PaymentGateway[] = [
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Global payment processing for internet businesses',
        logo: '/logos/stripe.svg',
        status: 'active',
        capabilities: ['cards', 'bank_transfer', 'digital_wallets', 'subscriptions'],
        supportedCountries: ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'NL', 'IE', 'IT', 'ES'],
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
        fees: { percentage: 2.9, fixed: 0.30, currency: 'USD' }
      },
      {
        id: 'paystack',
        name: 'Paystack',
        description: 'Simple, secure payment infrastructure for Africa',
        logo: '/logos/paystack.svg',
        status: 'active',
        capabilities: ['cards', 'bank_transfer', 'ussd', 'qr_code'],
        supportedCountries: ['NG', 'GH', 'ZA', 'KE'],
        supportedCurrencies: ['NGN', 'GHS', 'ZAR', 'KES'],
        fees: { percentage: 1.5, fixed: 100, currency: 'NGN' }
      },
      {
        id: 'flutterwave',
        name: 'Flutterwave',
        description: 'Payment infrastructure for global merchants',
        logo: '/logos/flutterwave.svg',
        status: 'active',
        capabilities: ['cards', 'bank_transfer', 'mobile_money', 'crypto'],
        supportedCountries: ['NG', 'GH', 'KE', 'UG', 'ZA', 'TZ'],
        supportedCurrencies: ['NGN', 'USD', 'EUR', 'GBP', 'GHS', 'KES'],
        fees: { percentage: 1.4, fixed: 0, currency: 'NGN' }
      },
      {
        id: 'wise',
        name: 'Wise (Multicurrency)',
        description: 'International money transfers and multi-currency accounts',
        logo: '/logos/wise.svg',
        status: 'active',
        capabilities: ['bank_transfer', 'multi_currency', 'fx_conversion'],
        supportedCountries: ['US', 'GB', 'EU', 'CA', 'AU', 'SG', 'NZ'],
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD', 'JPY'],
        fees: { percentage: 0.5, fixed: 0, currency: 'USD' }
      },
      {
        id: 'bap',
        name: 'BAP (Nigerian Banking)',
        description: 'Direct Nigerian banking integration',
        logo: '/logos/bap.svg',
        status: 'active',
        capabilities: ['bank_transfer', 'ussd', 'pos'],
        supportedCountries: ['NG'],
        supportedCurrencies: ['NGN'],
        fees: { percentage: 1.0, fixed: 50, currency: 'NGN' }
      }
    ];

    try {
      // Try to fetch from onasis-gateway
      const response = await fetch(`${this.baseUrl}/api/payment-gateways`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.gateways || defaultGateways;
      }
    } catch (error) {
      console.warn('Failed to fetch gateways from backend, using defaults:', error);
    }

    return defaultGateways;
  }

  /**
   * Initialize a payment transaction with smart routing
   */
  async initializePayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Use smart routing if no gateway specified
      const selectedGateway = paymentRequest.gateway || this.selectOptimalGateway(paymentRequest);
      
      const response = await fetch(`${this.baseUrl}/api/payment/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...paymentRequest,
          gateway: selectedGateway,
          callback_url: paymentRequest.redirectUrl,
          webhook_url: paymentRequest.webhookUrl,
          metadata: {
            ...paymentRequest.metadata,
            smart_routing: !paymentRequest.gateway, // Flag if smart routing was used
            selected_gateway: selectedGateway
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          transactionId: data.transaction_id || data.id,
          reference: data.reference || data.txn_ref,
          status: data.status || 'pending',
          gateway: selectedGateway,
          paymentUrl: data.payment_url || data.authorization_url || data.link,
          message: data.message || `Payment initialized via ${selectedGateway.toUpperCase()}`
        };
      } else {
        return {
          success: false,
          transactionId: '',
          reference: '',
          status: 'failed',
          gateway: selectedGateway,
          error: data.message || 'Payment initialization failed'
        };
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      const selectedGateway = paymentRequest.gateway || this.selectOptimalGateway(paymentRequest);
      return {
        success: false,
        transactionId: '',
        reference: '',
        status: 'failed',
        gateway: selectedGateway,
        error: 'Network error during payment initialization'
      };
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment(reference: string, gateway?: string): Promise<TransactionDetails | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payment/verify/${reference}?gateway=${gateway || 'stripe'}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          id: data.id || data.transaction_id,
          reference: data.reference || reference,
          amount: data.amount,
          currency: data.currency,
          status: data.status,
          gateway: data.gateway || gateway || 'stripe',
          customer: data.customer,
          createdAt: data.created_at || data.createdAt,
          updatedAt: data.updated_at || data.updatedAt,
          metadata: data.metadata
        };
      }
    } catch (error) {
      console.error('Payment verification error:', error);
    }

    return null;
  }

  /**
   * Get transaction history
   */
  async getTransactions(page: number = 1, limit: number = 50): Promise<{
    transactions: TransactionDetails[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/transactions?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          transactions: data.transactions || [],
          pagination: data.pagination || {
            page,
            limit,
            total: 0,
            totalPages: 0
          }
        };
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }

    // Return empty result on error
    return {
      transactions: [],
      pagination: { page, limit, total: 0, totalPages: 0 }
    };
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<{ success: boolean; message: string; services?: string[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: 'Connected to Onasis Gateway successfully',
          services: data.services || []
        };
      } else {
        return {
          success: false,
          message: `API connection failed: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export const paymentGatewayService = new PaymentGatewayService();
export default paymentGatewayService;