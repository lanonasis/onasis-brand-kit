import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Define Vanta.NET types
interface VantaNetEffect {
  destroy: () => void;
}
import {
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  Users,
  X as TwitterIcon,
  Linkedin,
  Brain,
  FileCheck,
  AlertTriangle,
  Lock,
  BarChart3,
  CreditCard,
  Lightbulb,
  ArrowRight,
  Facebook,
  Instagram,
  Building,
  ShoppingCart,
  GraduationCap,
  Truck,
  Home,
  Landmark,
  Terminal,
  Code2,
  Key,
  BookOpen,

  CheckCircle,
} from 'lucide-react';

import { HeroSection } from './components/HeroSection';
import { Features } from './components/Features';
import { DisplayCardsDemo } from './components/DisplayCardsDemo';
import { LogoCarouselDemo } from './components/LogoCarouselDemo';
// Commented out unused imports for backup file
// import { PricingTable } from './components/PricingTable';
// import { Testimonials } from './components/Testimonials';
// import { CallToAction } from './components/CallToAction';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import MCPConnection from './components/MCPConnection';
import Developers from './components/Developers';

// Responsive GlareCard component
const GlareCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (

    <div className={`relative isolate w-full max-w-sm mx-auto min-h-[400px] ${className}`}>
      <div className="h-full rounded-lg border border-slate-800 bg-slate-950/80 backdrop-blur-sm overflow-hidden hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
        {children}
      </div>
    </div>
  );
};

// Simple brand logo components (standalone)
const SimpleBrandLogos = {
  OpenAI: () => <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"><span className="text-xs text-white font-bold">AI</span></div>,
  Stripe: () => <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"><span className="text-xs text-white font-bold">$</span></div>,
  Supabase: () => <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"><span className="text-xs text-white font-bold">DB</span></div>,
  Anthropic: () => <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center"><span className="text-xs text-white font-bold">🤖</span></div>,
  Vercel: () => <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center"><span className="text-xs text-white font-bold">▲</span></div>,
  GitHub: () => <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center"><span className="text-xs text-white font-bold">💻</span></div>,
  PayPal: () => <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"><span className="text-xs text-white font-bold">PP</span></div>,
  AWS: () => <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"><span className="text-xs text-white font-bold">AWS</span></div>,
  Azure: () => <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"><span className="text-xs text-white font-bold">AZ</span></div>,
  Slack: () => <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center"><span className="text-xs text-white font-bold">SL</span></div>,
  Notion: () => <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center"><span className="text-xs text-white font-bold">NO</span></div>,
  Figma: () => <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center"><span className="text-xs text-white font-bold">FG</span></div>
};

const Timeline = React.lazy(() => import('./components/Timeline'));


function App() {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(true);
  // Removed isScrolled state and scroll event listener.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [vantaEffect, setVantaEffect] = useState<VantaNetEffect | null>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  // Convert to opacity value for class-based styling
  const headerOpacity = useTransform(
    scrollY,
    [0, 100],
    ['rgba(10, 25, 48, 0)', 'rgba(10, 25, 48, 0.9)']
  );


  useEffect(() => {
    let effect: VantaNetEffect | null = null;
    
    const initVanta = async () => {
      try {
        if (!vantaRef.current || vantaEffect) return;
        
        // Dynamically import Vanta to handle potential loading issues
        // Using type assertion for the dynamic import
        // This is necessary because the actual runtime structure of the module
        // doesn't perfectly match the TypeScript definition
        const VANTA = await import('vanta/dist/vanta.net.min');
        
        // Access the default export and initialize the effect
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const VantaNet = (VANTA as any).default.default;
        effect = VantaNet({
          el: vantaRef.current,
          THREE,
          color: 0x00b4ff,
          backgroundColor: 0x0a1930,
          points: 10,
          maxDistance: 25,
          spacing: 16,
        });
        
        setVantaEffect(effect);
      } catch (error) {
        console.warn('Vanta.js failed to initialize:', error);
        // Fallback: Apply a static gradient background
        if (vantaRef.current) {
          vantaRef.current.style.background = 'linear-gradient(135deg, #0a1930 0%, #1a2332 50%, #0a1930 100%)';
        }
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(initVanta, 100);

    return () => {
      clearTimeout(timer);
      if (effect) {
        try {
          effect.destroy();
        } catch (error) {
          console.warn('Error destroying Vanta effect:', error);
        }
      }
    };
  }, [vantaEffect]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  // Handle SSE auth route for registered users
  useEffect(() => {
    if (window.location.pathname === '/sse') {
      const handleSSEAuth = () => {
        // Check if user has existing context/session with robust parsing
        let hasContext = false;
        
        try {
          // Safely check localStorage
          const contextData = localStorage.getItem('lanonasis_context');
          if (contextData) {
            // Try to parse if it's JSON, otherwise treat as truthy
            try {
              const parsed = JSON.parse(contextData);
              hasContext = Boolean(parsed);
            } catch {
              hasContext = Boolean(contextData);
            }
          }
          
          // Check sessionStorage if not found
          if (!hasContext) {
            const sessionData = sessionStorage.getItem('user_session');
            if (sessionData) {
              try {
                const parsed = JSON.parse(sessionData);
                hasContext = Boolean(parsed);
              } catch {
                hasContext = Boolean(sessionData);
              }
            }
          }
          
          // Check cookies as fallback
          if (!hasContext) {
            hasContext = document.cookie.includes('lanonasis_auth');
          }
        } catch (error) {
          console.error('Error checking auth context:', error);
          hasContext = false;
        }
        
        if (hasContext) {
          // Direct route to dashboard for registered users
          window.location.href = 'https://dashboard.lanonasis.com/auth?redirect=dashboard&context=sse';
        } else {
          // Show quick context setup for new users
          window.location.href = 'https://dashboard.lanonasis.com/auth?redirect=onboard&context=sse';
        }
      };
      
      // Small delay to show loading state
      setTimeout(handleSSEAuth, 800);
    }
  }, []);

  // Handle MCP connection route
  if (window.location.pathname === '/mcp/connect' || activeSection === 'mcp') {
    return <MCPConnection />;
  }

  // Handle SSE auth route for registered users
  if (window.location.pathname === '/sse') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Brain className="w-16 h-16 mx-auto text-secondary mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">{t('sse.title')}</h1>
            <p className="text-gray-400">{t('sse.subtitle')}</p>
          </motion.div>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-200"></div>
          </div>
          
          <p className="text-sm text-gray-500">
            {t('sse.footer')}
          </p>
        </div>
      </div>
    );
  }

  const products = [
    {
      name: t('products.vortexcore_ai.name'),
      description: t('products.vortexcore_ai.description'),
      icon: Brain,
    },
    {
      name: t('products.vortexcomply.name'),
      description: t('products.vortexcomply.description'),
      icon: FileCheck,
    },
    {
      name: t('products.vortexrisk.name'),
      description: t('products.vortexrisk.description'),
      icon: AlertTriangle,
    },
    {
      name: t('products.vortexshield.name'),
      description: t('products.vortexshield.description'),
      icon: Lock,
    },
    {
      name: t('products.vortexiq.name'),
      description: t('products.vortexiq.description'),
      icon: BarChart3,
    },
    {
      name: t('products.vortexpay.name'),
      description: t('products.vortexpay.description'),
      icon: CreditCard,
    },
    {
      name: t('products.bizgenie.name'),
      description: t('products.bizgenie.description'),
      icon: Lightbulb,
    },
  ];

  const industries = [
    {
      name: "Financial Services & Fintech",
      icon: Building,
      hero: "Reimagining Finance: Intelligent, Compliant, Borderless",
      description: "Power your bank or fintech with VortexCore AI. Instantly onboard clients, automate KYC/KYB/AML, and enable secure cross-border payments—all within a modular, API-driven ecosystem.",
      valueProps: [
        "Seamless, compliant, and intelligent infrastructure for payments, compliance, and risk management",
        "Embedded finance and cross-border B2B payments",
        "AI-driven compliance (KYC, KYB, AML), fraud detection, and dynamic risk profiling",
        "Banking-as-a-Service APIs and RegTech for banks and fintechs"
      ],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "SMEs & Business Services",
      icon: Users,
      hero: "Empowering SMEs: Your Growth, Our Genius",
      description: "Meet BizGenie—your AI-powered business co-pilot. Track cash flow, get inventory alerts, and receive smart recommendations to scale.",
      valueProps: [
        "All-in-one platform for vendor verification, payments, working capital, and business intelligence",
        "Embedded AI assistant (BizGenie) for cash flow, inventory, and actionable insights",
        "Tiered onboarding for financial inclusion and growth",
        "Automated compliance and risk management for small businesses"
      ],
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "E-commerce & Marketplaces",
      icon: ShoppingCart,
      hero: "E-commerce, Evolved: Fast, Trusted, Global",
      description: "VortexPay delivers instant vendor payouts and multi-currency transfers, while VortexComply automates merchant onboarding and compliance.",
      valueProps: [
        "Instant vendor disbursements, multi-currency payments, and automated compliance",
        "Smart matching of buyers/sellers, dynamic pricing, and procurement optimization",
        "Business intelligence for inventory, sales, and risk management",
        "Seamless marketplace integration with full API support"
      ],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "Education",
      icon: GraduationCap,
      hero: "Transforming Education: Smart, Secure, Scalable",
      description: "Digital transformation for school management, payments, and compliance with easy onboarding solutions for institutions and students.",
      valueProps: [
        "Digital transformation for school management, payments, and compliance",
        "Easy onboarding and payment solutions for institutions and students",
        "Business intelligence for operational efficiency",
        "Secure student data management and financial tracking"
      ],
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "Logistics & Transportation",
      icon: Truck,
      hero: "Moving Forward: Intelligent Logistics Solutions",
      description: "Real-time payments, vendor verification, and compliance for logistics providers with fleet management integration.",
      valueProps: [
        "Real-time payments, vendor verification, and compliance for logistics providers",
        "Fleet management integration and secure cross-border settlements",
        "Supply chain optimization with AI-driven insights",
        "Automated documentation and regulatory compliance"
      ],
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "Real Estate",
      icon: Home,
      hero: "Real Estate Reimagined: Secure, Smart, Seamless",
      description: "Secure payment rails, compliance automation, and business intelligence for property transactions with trusted onboarding.",
      valueProps: [
        "Secure payment rails, compliance automation, and business intelligence for property transactions",
        "Trusted onboarding and risk management for real estate professionals",
        "Automated property verification and due diligence",
        "Cross-border investment facilitation with compliance"
      ],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "Public Sector & NGOs",
      icon: Landmark,
      hero: "Public Innovation: Transparent, Efficient, Impactful",
      description: "Digital compliance, payments, and financial inclusion tools for government and NGOs with secure, scalable infrastructure.",
      valueProps: [
        "Digital compliance, payments, and financial inclusion tools for government and NGOs",
        "Secure, scalable infrastructure for public sector innovation and empowerment",
        "Transparent fund management and impact tracking",
        "Citizen services digitization with AI-powered efficiency"
      ],
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80"
    },
  ];

  const visionPoints = t('vision.points', { returnObjects: true }) as string[];

  const socialTags = [
    "#LanOnasis",
    "#VortexCoreAI",
    "#RiskGPT",
    "#VortexPay",
    "#AfricanTech",
    "#Innovation",
  ];

  const getPageTitle = () => {
    switch (activeSection) {
      case 'industries':
        return 'Industries We Empower | Lan Onasis AI-Powered Solutions';
      default:
        return 'Lan Onasis | AI-Powered African Fintech Solutions Across Industries';
    }
  };

  const getPageDescription = () => {
    switch (activeSection) {
      case 'industries':
        return 'Discover how Lan Onasis transforms Financial Services, SMEs, E-commerce, Education, Logistics, Real Estate & Public Sector with AI-powered fintech solutions across Africa.';
      default:

        return 'Transform your business with Africa\'s leading AI-powered fintech ecosystem. Serving Financial Services, SMEs, E-commerce, Education, Logistics, Real Estate & Public Sector with secure compliance, smart payments, and intelligent risk management solutions.';
    }
  };

  const getPageKeywords = () => {
    switch (activeSection) {
      case 'industries':
        return 'African fintech industries, financial services AI, SME solutions, e-commerce payments, education technology, logistics fintech, real estate payments, public sector innovation, compliance automation, risk management, business intelligence';
      default:
        return 'African fintech, AI technology, compliance automation, risk management, B2B payments, business intelligence, financial services, SME solutions, e-commerce payments, education technology, logistics fintech, real estate payments, public sector innovation';
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'developers':
        return <Developers />;
      case 'industries':
        return (
          <section className="min-h-screen pt-20">
            {/* Industries Hero */}
            <div className="section-padding bg-primary-light">
              <div className="max-w-7xl mx-auto container-padding text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-secondary to-accent">
                      Industries We Empower
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
                    Transforming sectors across Africa and beyond with intelligent, compliant, and scalable solutions
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Industries Grid */}
            <div className="section-padding">
              <div className="max-w-7xl mx-auto container-padding">
                <div className="space-y-20">
                  {industries.map((industry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`grid lg:grid-cols-2 gap-12 items-center ${
                        index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                      }`}
                    >
                      <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mr-4">
                            <industry.icon className="w-8 h-8 text-secondary" />
                          </div>
                          <h2 className="text-2xl md:text-3xl font-bold">{industry.name}</h2>
                        </div>
                        
                        <div className="mb-6 p-6 bg-secondary/5 rounded-2xl border border-secondary/10">
                          <h3 className="text-xl font-semibold text-secondary mb-3">{industry.hero}</h3>
                          <p className="text-gray-300 text-lg leading-relaxed">{industry.description}</p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-white mb-4">Key Value Propositions:</h4>
                          {industry.valueProps.map((prop, propIndex) => (
                            <motion.div
                              key={propIndex}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: propIndex * 0.1 }}
                              className="flex items-start"
                            >
                              <ChevronRight className="text-secondary mt-1 mr-3 flex-shrink-0" size={16} />
                              <span className="text-gray-400">{prop}</span>
                            </motion.div>
                          ))}
                        </div>

                        <div className="mt-8">
                          <button className="btn-primary group">
                            Learn More
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>

                      <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                        <div className="relative h-[400px] rounded-2xl overflow-hidden group">
                          <img
                            src={industry.image}
                            alt={`${industry.name} solutions by Lan Onasis`}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-secondary/20 mix-blend-multiply" />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Industries CTA Section */}
            <div className="section-padding bg-primary-dark">
              <div className="max-w-4xl mx-auto container-padding text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready to Transform Your Industry?
                  </h2>
                  <p className="text-xl text-gray-400 mb-8">
                    Join the revolution. Let's build the future of your sector together with AI-powered solutions.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="btn-primary">
                      Schedule a Consultation
                    </button>
                    <button className="btn-secondary">
                      Explore Our Ecosystem
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        );

      default:
        return (
          <>
            <section 
              ref={vantaRef}
              className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a1930] via-[#1a2332] to-[#0a1930]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-primary pointer-events-none" />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block mb-6 px-4 py-1 rounded-full bg-secondary/10 border border-secondary/20"
                >
                  <span className="text-secondary font-semibold">{t('hero.badge')}</span>
                </motion.div>

                <motion.h1 
                  className="ai-hero-heading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <span 
                    className="ai-gradient-text ai-glow-effect ai-text-outline"
                    data-text="Powering Africa's Tech Revolution"
                  >
                    {t('hero.title')}
                  </span>
                </motion.h1>

                <motion.p 
                  className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {t('hero.subtitle')}
                </motion.p>

                <motion.div 
                  className="flex flex-col sm:flex-row justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <motion.a
                    href="https://dashboard.lanonasis.com/"
                    className="btn-primary flex items-center justify-center group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('hero.cta_primary')}
                    <motion.span
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    >
                      <ArrowRight size={20} />
                    </motion.span>
                  </motion.a>
                  
                  <motion.a
                    href="https://dashboard.lanonasis.com/"
                    className="btn-secondary group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('hero.cta_secondary')}
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </motion.a>
                </motion.div>

                <motion.div
                  className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="cursor-pointer"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                  >
                    <ChevronRight size={24} className="transform rotate-90 text-secondary" />
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute top-1/4 right-[10%] w-24 h-24 bg-secondary/10 rounded-full blur-xl"
                animate={{
                  y: [0, 20, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-1/4 left-[15%] w-32 h-32 bg-accent/10 rounded-full blur-xl"
                animate={{
                  y: [0, -30, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Floating Brand Icons */}
              <motion.div
                className="absolute top-[20%] left-[5%] opacity-20"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <SimpleBrandLogos.OpenAI />
              </motion.div>
              <motion.div
                className="absolute top-[60%] right-[8%] opacity-20"
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -360],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <SimpleBrandLogos.Stripe />
              </motion.div>
              <motion.div
                className="absolute bottom-[30%] left-[80%] opacity-15"
                animate={{
                  x: [-20, 20, -20],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <SimpleBrandLogos.Supabase />
              </motion.div>
            </section>

            <section id="vision" className="section-padding bg-primary-light">
              <div className="max-w-7xl mx-auto container-padding">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="relative h-[400px] bg-secondary/10 rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
                      alt="Digital Innovation and AI Technology"
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-transparent mix-blend-multiply" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">{t('vision.title')}</h2>
                    <ul className="space-y-4 mb-8">
                      {visionPoints.map((point, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-start"
                        >
                          <ChevronRight className="text-secondary mt-1 mr-2" size={20} />
                          <span className="text-lg">{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <p className="text-gray-400">
                      {t('vision.description')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="ecosystem" className="section-padding">
              <div className="max-w-7xl mx-auto container-padding">
                <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('ecosystem.title')}</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    {t('ecosystem.subtitle')}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105"
                    >
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                        <product.icon className="w-6 h-6 text-secondary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-400">{product.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Brand Partners Section */}
            <section className="section-padding bg-gradient-to-r from-primary-dark to-primary">
              <div className="max-w-7xl mx-auto container-padding">
                <div className="text-center mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Trusted by Leading Brands</h2>
                  <p className="text-gray-400">Powering integrations with the world's most innovative platforms</p>
                </div>
                
                {/* AI & Technology Partners */}
                <div className="mb-16">
                  <h3 className="text-xl font-semibold text-center mb-8 text-secondary">AI & Technology Partners</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                    <div className="flex justify-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <SimpleBrandLogos.OpenAI />
                    </div>
                    <div className="flex justify-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <SimpleBrandLogos.Anthropic />
                    </div>
                    <div className="flex justify-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <SimpleBrandLogos.Supabase />
                    </div>
                    <div className="flex justify-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <SimpleBrandLogos.Vercel />
                    </div>
                    <div className="flex justify-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <SimpleBrandLogos.GitHub />
                    </div>
                    <div className="flex justify-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <SimpleBrandLogos.OpenAI />
                    </div>
                  </div>
                </div>

                {/* Payment & Financial Partners */}
                <div className="mb-16">
                  <h3 className="text-xl font-semibold text-center mb-8 text-accent">Payment & Financial Solutions</h3>
                  <div className="flex flex-wrap justify-center gap-8">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <SimpleBrandLogos.Stripe />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <SimpleBrandLogos.PayPal />
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>

            {/* New Platform Services Section */}
            <section id="platform-services" className="section-padding bg-gradient-to-br from-primary-light to-primary">
              <div className="max-w-7xl mx-auto container-padding">
                <div className="text-center mb-20">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block mb-6 px-4 py-1 rounded-full bg-secondary/10 border border-secondary/20"
                  >
                    <span className="text-secondary font-semibold">{t('platform_services.badge')}</span>
                  </motion.div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('platform_services.title')}</h2>
                  <p className="text-gray-400 max-w-3xl mx-auto text-lg">
                    {t('platform_services.subtitle')}
                  </p>
                </div>

                {/* Service Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {/* Memory-as-a-Service */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="group bg-white/5 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 border border-white/10"
                  >
                    <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
                      <Brain className="w-7 h-7 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{t('platform_services.memory_service.title')}</h3>
                    <p className="text-gray-400 mb-4">{t('platform_services.memory_service.description')}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>{t('platform_services.memory_service.dashboard')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>{t('platform_services.memory_service.api')}</span>
                      </div>
                    </div>
                    <a href="https://dashboard.lanonasis.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 text-secondary hover:text-secondary-light transition-colors">
                      {t('platform_services.memory_service.cta')} <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>

                  {/* CLI Tool */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="group bg-white/5 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 border border-white/10"
                  >
                    <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
                      <Terminal className="w-7 h-7 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{t('platform_services.cli_tool.title')}</h3>
                    <p className="text-gray-400 mb-4">{t('platform_services.cli_tool.description')}</p>
                    <div className="bg-primary-dark/50 p-3 rounded-lg font-mono text-sm mb-4">
                      <code className="text-secondary">npm install -g @lanonasis/cli</code>
                    </div>
                    <a href="https://www.npmjs.com/package/@lanonasis/cli" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-secondary hover:text-secondary-light transition-colors">
                      {t('platform_services.cli_tool.cta')} <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>

                  {/* SDK */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="group bg-white/5 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 border border-white/10"
                  >
                    <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
                      <Code2 className="w-7 h-7 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{t('platform_services.sdk.title')}</h3>
                    <p className="text-gray-400 mb-4">{t('platform_services.sdk.description')}</p>
                    <div className="bg-primary-dark/50 p-3 rounded-lg font-mono text-sm mb-4">
                      <code className="text-secondary">npm install @lanonasis/sdk</code>
                    </div>
                    <a href="https://docs.lanonasis.com/sdk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-secondary hover:text-secondary-light transition-colors">
                      {t('platform_services.sdk.cta')} <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>

                  {/* API Key Management */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="group bg-white/5 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 border border-white/10"
                  >
                    <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
                      <Key className="w-7 h-7 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{t('platform_services.api_keys.title')}</h3>
                    <p className="text-gray-400 mb-4">{t('platform_services.api_keys.description')}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>{t('platform_services.api_keys.zero_trust')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>{t('platform_services.api_keys.mcp_support')}</span>
                      </div>
                    </div>
                    <a href="https://dashboard.lanonasis.com/dashboard/api-keys" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 text-secondary hover:text-secondary-light transition-colors">
                      {t('platform_services.api_keys.cta')} <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>

                  {/* Developer Portal */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="group bg-white/5 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 border border-white/10"
                  >
                    <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
                      <BookOpen className="w-7 h-7 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{t('platform_services.developer_portal.title')}</h3>
                    <p className="text-gray-400 mb-4">{t('platform_services.developer_portal.description')}</p>
                    <a href="https://docs.lanonasis.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 text-secondary hover:text-secondary-light transition-colors">
                      {t('platform_services.developer_portal.cta')} <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>

                  {/* MCP Integration */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="group bg-white/5 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 border border-white/10"
                  >
                    <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-6">
                      <Terminal className="w-7 h-7 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{t('platform_services.mcp_integration.title')}</h3>
                    <p className="text-gray-400 mb-4">{t('platform_services.mcp_integration.description')}</p>
                    <div className="bg-primary-dark/50 p-3 rounded-lg font-mono text-sm mb-4">
                      <code className="text-secondary">mcp.lanonasis.com/sse</code>
                    </div>
                    <a href="https://mcp.lanonasis.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-secondary hover:text-secondary-light transition-colors">
                      {t('platform_services.mcp_integration.cta')} <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>
                </div>

                {/* Quick Start CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-2xl p-8 md:p-12 border border-secondary/20"
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{t('platform_services.quick_start.title')}</h3>
                  <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                    {t('platform_services.quick_start.description')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="https://dashboard.lanonasis.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-secondary hover:bg-secondary-dark text-primary font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      {t('platform_services.quick_start.cta_primary')} <ArrowRight className="w-5 h-5" />
                    </a>
                    <a
                      href="https://docs.lanonasis.com/quickstart"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-secondary text-secondary hover:bg-secondary/10 font-semibold rounded-lg transition-all duration-300"
                    >
                      {t('platform_services.quick_start.cta_secondary')}
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Cloud & Infrastructure Showcase */}
            <section className="section-padding bg-gradient-to-br from-primary to-primary-dark">
              <div className="max-w-7xl mx-auto container-padding">
                <div className="text-center mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Enterprise Infrastructure</h2>
                  <p className="text-gray-400">Built on world-class cloud platforms</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {[
                    SimpleBrandLogos.AWS,
                    SimpleBrandLogos.Azure,
                    SimpleBrandLogos.AWS,
                    SimpleBrandLogos.AWS,
                    SimpleBrandLogos.AWS
                  ].map((Icon, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 p-6 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all group"
                    >
                      <div className="w-20 h-20 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                        <Icon />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <section id="story" className="section-padding bg-primary-dark">
              <div className="max-w-7xl mx-auto container-padding">
                <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('story.title')}</h2>
                  <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    {t('story.subtitle')}
                  </p>
                </div>

                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
                  </div>

                }>
                  <Timeline />
                </Suspense>

                <div className="max-w-4xl mx-auto text-center mt-20">
                  <p className="text-xl leading-relaxed mb-12">
                    {t('story.conclusion')}
                  </p>
                </div>
              </div>
            </section>

            {/* Productivity & Business Tools Showcase */}
            <section className="py-16 bg-gradient-to-r from-secondary/10 to-accent/10">
              <div className="max-w-7xl mx-auto container-padding">
                <h3 className="text-2xl font-bold text-center mb-8">Productivity & Business Solutions</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4 mb-12">
                  {[
                    SimpleBrandLogos.Notion,
                    SimpleBrandLogos.Slack,
                    SimpleBrandLogos.Figma,
                    SimpleBrandLogos.Figma,
                    SimpleBrandLogos.Slack,
                    SimpleBrandLogos.Figma,
                    SimpleBrandLogos.Slack,
                    SimpleBrandLogos.AWS
                  ].map((Icon, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/10 p-4 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all"
                    >
                      <div className="w-12 h-12 flex items-center justify-center">
                        <Icon />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-12 bg-secondary/10">
              <div className="max-w-7xl mx-auto container-padding">
                <div className="flex flex-wrap justify-center gap-4">
                  {socialTags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="text-secondary font-semibold text-lg md:text-xl"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Modern Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-secondary">Lan Onasis</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#platform" className="text-gray-300 hover:text-secondary transition-colors">Platform</a>
              <a href="#ecosystem" className="text-gray-300 hover:text-secondary transition-colors">Ecosystem</a>
              <a href="#solutions" className="text-gray-300 hover:text-secondary transition-colors">Solutions</a>
              <a href="#developers" className="text-gray-300 hover:text-secondary transition-colors">Developers</a>
              <a href="https://dashboard.lanonasis.com/" className="btn-primary text-sm px-4 py-2">Get Started</a>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Platform Features */}
      <Features />

      {/* Platform Demo */}
      <DisplayCardsDemo />

      {/* Ecosystem Overview */}
      <section id="ecosystem" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Our Financial Technology Ecosystem
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              AI-powered fintech solutions transforming how businesses operate across Africa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <GlareCard className="bg-gradient-to-br from-blue-900/20 to-purple-900/20">
              <div className="p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg mb-4 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">VortexCore AI</h3>
                  <p className="text-gray-300 mb-4">
                    Intelligent AI platform that automates compliance, streamlines operations, and delivers actionable insights for African businesses.
                  </p>
                </div>
                <div className="flex items-center text-blue-400 font-medium">
                  Explore Platform <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </GlareCard>

            <GlareCard className="bg-gradient-to-br from-green-900/20 to-teal-900/20">
              <div className="p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg mb-4 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">VortexPay</h3>
                  <p className="text-gray-300 mb-4">
                    Instant B2B payments and vendor disbursements with intelligent routing and multi-currency support across Africa.
                  </p>
                </div>
                <div className="flex items-center text-green-400 font-medium">
                  Launch Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </GlareCard>

            <GlareCard className="bg-gradient-to-br from-purple-900/20 to-pink-900/20">
              <div className="p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">BizGenie</h3>
                  <p className="text-gray-300 mb-4">
                    AI-powered business intelligence providing SME insights, cash flow forecasting, and automated financial guidance.
                  </p>
                </div>
                <div className="flex items-center text-purple-400 font-medium">
                  Try Beta <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </GlareCard>

            <GlareCard className="bg-gradient-to-br from-orange-900/20 to-red-900/20">
              <div className="p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg mb-4 flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">VortexComply</h3>
                  <p className="text-gray-300 mb-4">
                    Automated KYC, KYB, and AML compliance solutions ensuring regulatory adherence across African financial markets.
                  </p>
                </div>
                <div className="flex items-center text-orange-400 font-medium">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </GlareCard>

            <GlareCard className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
              <div className="p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-cyan-500 rounded-lg mb-4 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">RiskGPT</h3>
                  <p className="text-gray-300 mb-4">
                    AI-driven risk assessment and real-time monitoring with predictive analytics for proactive business protection.
                  </p>
                </div>
                <div className="flex items-center text-cyan-400 font-medium">
                  View Demo <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </GlareCard>

            <GlareCard className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
              <div className="p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-indigo-500 rounded-lg mb-4 flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">API Gateway</h3>
                  <p className="text-gray-300 mb-4">
                    Comprehensive REST and GraphQL APIs with SDKs, webhooks, and real-time integrations for seamless development.
                  </p>
                </div>
                <div className="flex items-center text-indigo-400 font-medium">
                  Access APIs <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </GlareCard>
          </div>
        </div>
      </section>

      {/* Platform Services */}
      <LogoCarouselDemo />

      {/* Innovation Hub */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent">
              Innovation & Research
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cutting-edge research and experimental projects that shape the future of business and creativity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <GlareCard className="bg-gradient-to-br from-amber-900/20 to-orange-900/20">
              <div className="p-6 h-full flex flex-col justify-between text-center">
                <div>
                  <div className="w-12 h-12 bg-amber-500 rounded-lg mb-4 flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-white">AI Research Lab</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Advanced AI research in natural language processing, computer vision, and predictive analytics for African markets.
                  </p>
                </div>
                <div className="text-amber-400 font-medium text-sm">
                  Explore Research
                </div>
              </div>
            </GlareCard>

            <GlareCard className="bg-gradient-to-br from-rose-900/20 to-pink-900/20">
              <div className="p-6 h-full flex flex-col justify-between text-center">
                <div>
                  <div className="w-12 h-12 bg-rose-500 rounded-lg mb-4 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-white">Security Innovation</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Zero-trust security architecture, encrypted communications, and privacy-preserving financial technologies.
                  </p>
                </div>
                <div className="text-rose-400 font-medium text-sm">
                  Learn More
                </div>
              </div>
            </GlareCard>

            <GlareCard className="bg-gradient-to-br from-sky-900/20 to-blue-900/20">
              <div className="p-6 h-full flex flex-col justify-between text-center">
                <div>
                  <div className="w-12 h-12 bg-sky-500 rounded-lg mb-4 flex items-center justify-center mx-auto">
                    <Key className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-white">Blockchain Labs</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Blockchain research for cross-border payments, smart contracts, and decentralized financial infrastructure.
                  </p>
                </div>
                <div className="text-sky-400 font-medium text-sm">
                  Join Beta
                </div>
              </div>
            </GlareCard>

            <GlareCard className="bg-gradient-to-br from-lime-900/20 to-green-900/20">
              <div className="p-6 h-full flex flex-col justify-between text-center">
                <div>
                  <div className="w-12 h-12 bg-lime-500 rounded-lg mb-4 flex items-center justify-center mx-auto">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-white">Learning Platform</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Fintech education, API documentation, developer tutorials, and business intelligence training programs.
                  </p>
                </div>
                <div className="text-lime-400 font-medium text-sm">
                  Start Learning
                </div>
              </div>
            </GlareCard>
          </div>
        </div>
      </section>


      {/* Built by Visionaries Timeline */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Built by Visionaries
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our journey of innovation and creativity - from concept to global impact
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-400 to-pink-600 h-full"></div>
            <div className="space-y-12">
              {[
                { year: "2020", title: "Foundation", description: "[Placeholder: The beginning of our journey - founded with a vision to revolutionize business creativity]", icon: "🚀" },
                { year: "2021", title: "First Product Launch", description: "[Placeholder: VortexCore AI launched, transforming how businesses approach automation and decision-making]", icon: "🧠" },
                { year: "2022", title: "Global Expansion", description: "[Placeholder: Expanded to serve creative businesses across 50+ countries with localized solutions]", icon: "🌍" },
                { year: "2023", title: "Innovation Milestone", description: "[Placeholder: Breakthrough in AI-driven creativity tools, serving 100,000+ creative professionals]", icon: "💡" },
                { year: "2024", title: "Future Vision", description: "[Placeholder: Pioneering the next generation of business creativity and innovation platforms]", icon: "✨" }
              ].map((event, index) => (
                <div key={event.year} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                      <div className="text-2xl mb-2">{event.icon}</div>
                      <div className="text-purple-400 font-semibold text-lg">{event.year}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-gray-300 text-sm">{event.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full border-4 border-gray-900"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Cards Stack Demo */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Experience the Platform
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Interactive demos showcasing the power of our creative business solutions
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-white/10 hover:border-blue-400/50 transition-colors">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">Analytics Dashboard</h3>
                  <p className="text-gray-300">Live performance metrics</p>
                </div>
              </div>
              <div className="h-64 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg flex items-center justify-center border border-white/10 hover:border-green-400/50 transition-colors">
                <div className="text-center">
                  <Lightbulb className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">Smart Workflows</h3>
                  <p className="text-gray-300">Automated creative processes</p>
                </div>
              </div>
              <div className="h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-white/10 hover:border-purple-400/50 transition-colors">
                <div className="text-center">
                  <CreditCard className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">Payment Solutions</h3>
                  <p className="text-gray-300">Integrated financial tools</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- End New Sections --- */}
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="keywords" content={getPageKeywords()} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://lanonasis.com/${activeSection === 'home' ? '' : activeSection}`} />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:image" content="https://lanonasis.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Lan Onasis" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@lanonasis" />
        <meta name="twitter:creator" content="@lanonasis" />
        <meta name="twitter:title" content={getPageTitle()} />
        <meta name="twitter:description" content={getPageDescription()} />
        <meta name="twitter:image" content="https://lanonasis.com/twitter-image.png" />
        
        {/* Additional Meta Tags */}
        <meta name="author" content="Lan Onasis" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href={`https://lanonasis.com/${activeSection === 'home' ? '' : activeSection}`} />
        
        {/* Industry-specific meta tags for Industries page */}
        {activeSection === 'industries' && (
          <>
            <meta name="industry" content="Financial Technology, Artificial Intelligence, Compliance Technology, Payment Processing, Business Intelligence, E-commerce Solutions, Education Technology, Logistics Technology, Real Estate Technology, Government Technology" />
            <meta name="target-audience" content="Financial Institutions, SMEs, E-commerce Platforms, Educational Institutions, Logistics Companies, Real Estate Firms, Government Agencies, NGOs" />
            <meta name="geo.region" content="Africa" />
            <meta name="geo.placename" content="Africa" />
          </>
        )}
      </Helmet>

      <motion.nav
        className="fixed w-full z-50 backdrop-blur-lg bg-primary"
        style={{ backgroundColor: headerOpacity }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => handleSectionChange('home')}
                className="text-2xl font-bold text-secondary hover:text-secondary/80 transition-colors"
              >
                {t('app.name')}
              </button>
              <div className="hidden md:flex space-x-8">
                <button
                  onClick={() => handleSectionChange('developers')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeSection === 'developers'
                      ? 'bg-secondary text-primary'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {t('navigation.developers')}
                </button>
                <a href="#ecosystem" className="hover:text-secondary transition-colors">{t('navigation.products')}</a>
                <button
                  onClick={() => handleSectionChange('industries')}
                  className={`hover:text-secondary transition-colors ${
                    activeSection === 'industries' ? 'text-secondary' : ''
                  }`}
                >
                  {t('navigation.industries')}
                </button>
                <a href="#platform-services" className="hover:text-secondary transition-colors">{t('navigation.services')}</a>
                <a href="#contact" className="hover:text-secondary transition-colors">{t('navigation.contact')}</a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher />
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <a href="https://dashboard.lanonasis.com/" className="btn-secondary mr-4">
                {t('navigation.login')}
              </a>
              <a href="https://dashboard.lanonasis.com/" className="btn-primary">
                {t('navigation.signup')}
              </a>
            </div>
            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-primary/95 backdrop-blur-lg overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                <div className="flex justify-center mb-4">
                  <LanguageSwitcher />
                </div>
                <button
                  onClick={() => handleSectionChange('home')}
                  className={`block w-full text-left hover:text-secondary transition-colors ${
                    activeSection === 'home' ? 'text-secondary' : ''
                  }`}
                >
                  {t('navigation.home')}
                </button>
                <button
                  onClick={() => handleSectionChange('developers')}
                  className={`block w-full text-left hover:text-secondary transition-colors ${
                    activeSection === 'developers' ? 'text-secondary' : ''
                  }`}
                >
                  {t('navigation.developers')}
                </button>
                <a href="#ecosystem" className="block hover:text-secondary transition-colors">Products</a>
                <button
                  onClick={() => handleSectionChange('industries')}
                  className={`block w-full text-left hover:text-secondary transition-colors ${
                    activeSection === 'industries' ? 'text-secondary' : ''
                  }`}
                >
                  {t('navigation.industries')}
                </button>
                <a href="#platform-services" className="block hover:text-secondary transition-colors">Services</a>
                <a href="#contact" className="block hover:text-secondary transition-colors">Contact</a>
                <a href="https://dashboard.lanonasis.com/" className="btn-secondary w-full mb-4 text-center block">
                  {t('navigation.login')}
                </a>
                <a href="https://dashboard.lanonasis.com/" className="btn-primary w-full text-center block">
                  {t('navigation.signup')}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {renderContent()}

      <footer id="contact" className="bg-primary-darker py-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t('app.name')}</h3>
              <p className="text-gray-400 mb-4">
                {t('footer.description')}
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com/lanonasis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram size={24} />
                </a>
                <a 
                  href="https://twitter.com/lanonasis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors"
                  aria-label="Follow us on Twitter"
                >
                  <TwitterIcon size={24} />
                </a>
                <a 
                  href="https://facebook.com/Lan-Onasis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook size={24} />
                </a>
                <a 
                  href="https://linkedin.com/company/the-lan-onasis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors"
                  aria-label="Follow us on LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.products_title')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-secondary transition-colors">VortexCore AI</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">VortexComply</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">VortexRisk</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">VortexPay</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">BizGenie</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.industries_title')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-secondary transition-colors">Financial Services</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">SMEs & Business</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">E-commerce</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Education</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Logistics</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Real Estate</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Public Sector</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.get_in_touch')}</h4>
              <div className="space-y-4">
                <p className="text-gray-400">
                  <a 
                    href="https://www.lanonasis.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-secondary transition-colors"
                  >
                    www.lanonasis.com
                  </a>
                </p>
                <a 
                  href="mailto:info@lanonasis.com"
                  className="text-gray-400 hover:text-secondary transition-colors block"
                >
                  info@lanonasis.com
                </a>
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder={t('footer.email_placeholder')}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-secondary transition-colors"
                  />
                  <button type="submit" className="btn-primary w-full">
                    {t('navigation.subscribe')}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} {t('app.name')}. {t('footer.copyright')}</p>
            <div className="mt-4 space-x-4 text-sm">
              <a href="#" className="hover:text-secondary transition-colors">{t('footer.privacy_policy')}</a>
              <a href="#" className="hover:text-secondary transition-colors">{t('footer.terms_of_service')}</a>
              <a href="#" className="hover:text-secondary transition-colors">{t('footer.cookie_policy')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
