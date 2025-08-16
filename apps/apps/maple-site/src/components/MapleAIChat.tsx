import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, X, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MapleAIChatProps {
  onClose: () => void;
  onBack: () => void;
}

const MapleAIChat = ({ onClose, onBack }: MapleAIChatProps) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Maple AI, your intelligent assistant for the Lan Onasis ecosystem. I can help you with wealth management strategies, sports insights, or any questions about our platform. What would you like to explore? 🍁',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  
  const MESSAGE_LIMIT = 10;
  const CONTEXT_LIMIT = 12; // Keep last 12 messages for context

  const scrollToSection = (sectionId: string) => {
    onClose(); // Close chat first
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get relevant context messages (preserve first message + last 10-12 messages)
  const getContextMessages = () => {
    if (messages.length <= CONTEXT_LIMIT) {
      return messages;
    }
    
    // Always include the first assistant message (greeting) for context
    const firstMessage = messages[0];
    const recentMessages = messages.slice(-CONTEXT_LIMIT + 1);
    
    return [firstMessage, ...recentMessages];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || showSignupPrompt) return;

    // Check message limit
    if (messageCount >= MESSAGE_LIMIT) {
      setShowSignupPrompt(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setMessageCount(prev => prev + 1);

    try {
      // Enhanced system prompt for investor demo
      const systemPrompt = `You are Maple AI, the advanced AI assistant for Lan Onasis Maple - Africa's leading AI-powered fintech ecosystem with a unified platform serving multiple industries.

🏢 COMPANY OVERVIEW:
- Part of the $50M+ Lan Onasis Group ecosystem with 18+ integrated services
- Maple Wealth: Comprehensive financial planning with AI-driven portfolio optimization
- Maple Sport: Real-time sports analytics and Canadian market insights
- Onasis Gateway: Enterprise API platform with 1000+ tools serving international clients
- Serves 1000+ clients across Canada and expanding globally

💼 ADVANCED CAPABILITIES:
- AI-powered investment portfolio recommendations based on risk tolerance and goals
- Real-time market analysis and financial trend predictions
- Automated estate planning with tax optimization strategies
- Multi-currency international payment processing (18+ payment gateways)
- Advanced sports analytics with predictive modeling for Canadian leagues
- Enterprise-grade compliance (PCI DSS, GDPR, PSD2) and security

🎯 UNIQUE VALUE PROPOSITION:
- Only platform combining AI-driven wealth management with sports culture insights
- Proprietary algorithms for personalized financial strategies
- Real-time integration with major Canadian financial institutions
- Advanced multi-language support (11 languages) with cultural adaptation
- Enterprise API platform generating revenue from multiple verticals

💡 INNOVATION HIGHLIGHTS:
- AI-native architecture with machine learning optimization
- Predictive analytics for both financial markets and sports performance
- Automated compliance monitoring and reporting
- Real-time fraud detection and risk assessment
- Advanced customer behavior analytics for personalized experiences

TONE: Sophisticated, intelligent, showcase technical depth while remaining approachable
LANGUAGE: Respond in ${i18n.language === 'en' ? 'English' : i18n.language}
GOAL: Demonstrate platform sophistication and business potential to impress investors
Keep responses detailed enough to show depth but concise enough to maintain engagement.`;

      // Call Supabase edge function for AI chat
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL=https://<project-ref>.supabase.co
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY=REDACTED_SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          prompt: `IMPORTANT: You are Maple AI, not BizGenie. You represent Lan Onasis Maple platform.\n\n${systemPrompt}\n\nConversation History:\n${getContextMessages().map(m => `${m.role}: ${m.content}`).join('\n')}\n\nUser: ${inputMessage}\n\nMaple AI:`,
          language: i18n.language,
          provider: 'perplexity',
          model: 'llama-3.1-sonar-small-128k-online',
          override_identity: true,
          ai_name: "Maple AI"
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I\'m having trouble responding right now. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m sorry, I\'m experiencing some technical difficulties. Please try again in a moment or contact our support team.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="w-80 h-96 flex flex-col shadow-xl border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <Bot className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-foreground">Chat with Maple AI</h4>
        </div>
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Message count indicator */}
        {messageCount > 6 && !showSignupPrompt && (
          <div className="text-center">
            <div className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-xs">
              {MESSAGE_LIMIT - messageCount} demo messages remaining
            </div>
          </div>
        )}

        {/* Context management indicator */}
        {messages.length > CONTEXT_LIMIT && !showSignupPrompt && (
          <div className="text-center">
            <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs">
              💭 Smart context: Keeping {getContextMessages().length} most relevant messages
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-2 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot className="h-3 w-3 text-primary" />
              </div>
            )}
            <div
              className={`max-w-xs p-2 rounded-lg text-sm ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {message.content}
            </div>
            {message.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <User className="h-3 w-3 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
        
        {/* Signup prompt */}
        {showSignupPrompt && (
          <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
            <Bot className="h-8 w-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold text-foreground mb-2">🚀 Impressed? Let's continue!</h4>
            <p className="text-sm text-muted-foreground mb-4">
              You've experienced Maple AI's capabilities in this demo. Ready to unlock the full potential of our AI-powered wealth management and sports analytics platform?
            </p>
            <div className="space-y-2">
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                onClick={() => scrollToSection('book')}
              >
                Book Full Consultation
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => scrollToSection('about')}
              >
                Learn More About Maple
              </Button>
            </div>
          </div>
        )}
        
        {isLoading && !showSignupPrompt && (
          <div className="flex items-start space-x-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Bot className="h-3 w-3 text-primary" />
            </div>
            <div className="bg-muted text-muted-foreground p-2 rounded-lg text-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        {!showSignupPrompt ? (
          <>
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Maple..."
                className="flex-1 text-sm"
                disabled={isLoading || messageCount >= MESSAGE_LIMIT}
              />
              <Button
                onClick={sendMessage}
                size="sm"
                disabled={!inputMessage.trim() || isLoading || messageCount >= MESSAGE_LIMIT}
                className="flex-shrink-0"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">
                Powered by Maple AI • Press Enter to send
              </p>
              <p className="text-xs text-muted-foreground">
                {messageCount}/{MESSAGE_LIMIT} demo messages
              </p>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Demo complete • Ready to explore the full platform?
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MapleAIChat;