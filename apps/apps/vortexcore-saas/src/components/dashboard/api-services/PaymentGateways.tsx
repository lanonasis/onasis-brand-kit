
import { useState, useEffect } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, CreditCard, Info, ExternalLink, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { paymentGatewayService, PaymentGateway, PaymentRequest } from "@/services/paymentGatewayService";
import { toast } from "@/hooks/use-toast";

export const PaymentGateways = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showApiGuide, setShowApiGuide] = useState(false);
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [testForm, setTestForm] = useState({
    amount: '100',
    currency: 'USD',
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/25',
    cvc: '123',
    email: 'test@example.com',
    name: 'Test User',
    country: ''
  });

  useEffect(() => {
    loadGateways();
  }, []);

  const loadGateways = async () => {
    try {
      setLoading(true);
      const gatewayData = await paymentGatewayService.getAvailableGateways();
      setGateways(gatewayData);
    } catch (error) {
      console.error('Failed to load gateways:', error);
      toast({
        title: "Error",
        description: "Failed to load payment gateways",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestPayment = async () => {
    try {
      setProcessing(true);

      const paymentRequest: PaymentRequest = {
        amount: parseFloat(testForm.amount) * 100, // Convert to cents
        currency: testForm.currency,
        // No gateway specified - let smart routing decide
        customer: {
          email: testForm.email,
          name: testForm.name,
          country: testForm.country || undefined
        },
        metadata: {
          source: 'vortexcore-saas-sandbox',
          test: true
        }
      };

      const response = await paymentGatewayService.initializePayment(paymentRequest);

      if (response.success) {
        toast({
          title: "Payment Initialized",
          description: `Transaction ${response.transactionId} created successfully`,
        });

        if (response.paymentUrl) {
          // Open payment URL in new tab
          window.open(response.paymentUrl, '_blank');
        }
      } else {
        toast({
          title: "Payment Failed",
          description: response.error || "Failed to initialize payment",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing the payment",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold">Payment Gateway APIs</h3>
        <p className="text-muted-foreground">
          Integrate multiple payment gateways with a single API
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Payment Gateway Integration</AlertTitle>
            <AlertDescription>
              Our unified payment API lets you connect to multiple payment providers with a single integration.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard title="Supported Gateways" className="h-auto">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {gateways.map((gateway) => (
                    <div key={gateway.id} className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        gateway.status === 'active' ? 'bg-green-500' : 
                        gateway.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm">{gateway.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({gateway.supportedCurrencies.slice(0, 3).join(', ')})
                      </span>
                    </div>
                  ))}
                  {gateways.length === 0 && (
                    <p className="text-sm text-muted-foreground">No gateways available</p>
                  )}
                </div>
              )}
            </DashboardCard>
            
            <DashboardCard title="Features" className="h-auto">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Single API for all gateways</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Automatic failover</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Comprehensive webhooks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Payment analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Fraud detection</span>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard title="Quick Start" className="h-auto">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Get started with our payment gateway API in minutes
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab("documentation")}
                >
                  View Documentation
                </Button>
                <Button className="w-full" onClick={() => setActiveTab("sandbox")}>
                  Try Sandbox
                </Button>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="documentation" className="space-y-4 pt-4">
          <DashboardCard title="API Documentation" className="h-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium">Payment Gateway API</h4>
                <Button variant="outline" onClick={() => setShowApiGuide(!showApiGuide)}>
                  {showApiGuide ? "Hide API Guide" : "Show API Guide"}
                </Button>
              </div>
              
              {showApiGuide && (
                <div className="space-y-4 bg-muted p-4 rounded-md">
                  <h5 className="font-medium">API Endpoint</h5>
                  <pre className="bg-background p-2 rounded overflow-x-auto">
                    <code>POST https://api.vortexcore.io/v1/payments/charge</code>
                  </pre>
                  
                  <h5 className="font-medium">Request Body</h5>
                  <pre className="bg-background p-2 rounded overflow-x-auto">
                    <code>{`{
  "amount": 1000,
  "currency": "USD",
  "payment_method": "card",
  "gateway": "stripe", // Optional, will use default if not specified
  "customer": {
    "email": "customer@example.com",
    "name": "John Doe"
  },
  "metadata": {
    "order_id": "ORD-123456"
  }
}`}</code>
                  </pre>
                  
                  <h5 className="font-medium">Response</h5>
                  <pre className="bg-background p-2 rounded overflow-x-auto">
                    <code>{`{
  "status": "success",
  "data": {
    "transaction_id": "txn_1234567890",
    "amount": 1000,
    "currency": "USD",
    "status": "pending",
    "gateway": "stripe",
    "created_at": "2023-06-01T12:00:00Z",
    "payment_url": "https://checkout.stripe.com/..."
  }
}`}</code>
                  </pre>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Need Help?</AlertTitle>
                    <AlertDescription>
                      Refer to our detailed documentation for more information on all available endpoints and parameters.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              
              <div className="space-y-2">
                <h5 className="font-medium">SDKs & Libraries</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 18.1833L5.1075 13.7167V4.78335L12 9.25002L18.8925 4.78335V13.7167L12 18.1833Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19.7501 19.2499L4.25006 19.2499" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    JavaScript SDK
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    PHP SDK
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 5H21V19H3V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 9H7.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11 9H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Python SDK
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5H16M12 5V19M5 9H8.5M5 12H8.5M5 15H8.5M15.5 9H19M15.5 12H19M15.5 15H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Java SDK
                  </Button>
                </div>
              </div>
            </div>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="sandbox" className="space-y-4 pt-4">
          <DashboardCard title="Test Payment Gateway" className="h-auto">
            <div className="space-y-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sandbox Environment</AlertTitle>
                <AlertDescription>
                  This is a test environment. No real transactions will be processed.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4 max-w-md mx-auto">
                <div className="space-y-2">
                  <h4 className="text-lg font-medium">Test Payment</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Amount</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          className="flex-1 rounded-r-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="Amount"
                          value={testForm.amount}
                          onChange={(e) => setTestForm(prev => ({ ...prev, amount: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Currency</label>
                        <select 
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={testForm.currency}
                          onChange={(e) => setTestForm(prev => ({ ...prev, currency: e.target.value }))}
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="NGN">NGN - Nigerian Naira</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="CAD">CAD - Canadian Dollar</option>
                          <option value="GHS">GHS - Ghanaian Cedi</option>
                          <option value="KES">KES - Kenyan Shilling</option>
                          <option value="ZAR">ZAR - South African Rand</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Country (Optional)</label>
                        <select 
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={testForm.country}
                          onChange={(e) => setTestForm(prev => ({ ...prev, country: e.target.value }))}
                        >
                          <option value="">Auto-detect</option>
                          <option value="US">United States</option>
                          <option value="NG">Nigeria</option>
                          <option value="GB">United Kingdom</option>
                          <option value="CA">Canada</option>
                          <option value="GH">Ghana</option>
                          <option value="KE">Kenya</option>
                          <option value="ZA">South Africa</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Card Number</label>
                      <input
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="4242 4242 4242 4242"
                        defaultValue="4242 4242 4242 4242"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Expiry</label>
                        <input
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="MM/YY"
                          defaultValue="12/25"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">CVC</label>
                        <input
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="CVC"
                          defaultValue="123"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleTestPayment}
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4 mr-2" />
                  )}
                  {processing ? 'Processing...' : 'Process Test Payment'}
                </Button>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Smart Routing:</strong> Gateway automatically selected based on currency/country</p>
                  <p><strong>Test Card:</strong> 4242 4242 4242 4242 | Any future date | Any 3 digits</p>
                  <p><strong>Local (NGN/African):</strong> Routes to Paystack/SaySwitch</p>
                  <p><strong>International (USD/EUR):</strong> Routes to Stripe/PayPal/Wise</p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
