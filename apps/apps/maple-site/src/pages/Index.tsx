import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Menu, 
  X, 
  TrendingUp, 
  Shield, 
  PieChart, 
  FileText, 
  RotateCcw,
  Trophy,
  Users,
  MessageSquare,
  BarChart3,
  Heart,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import mapleLogoImage from "@/assets/maple-logo.png";
import heroBannerImage from "@/assets/hero-banner.jpg";
import { AppointmentCalendar } from "@/components/AppointmentCalendar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MapleAIChat from "@/components/MapleAIChat";
import GatewayLoginTester from "@/components/GatewayLoginTester";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ["home", "wealth", "sport", "about", "blog", "book"];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const wealthFeatures = [
    { icon: TrendingUp, title: "Financial Planning", description: "Strategic roadmaps for your financial future" },
    { icon: Shield, title: "Estate Planning", description: "Protect and transfer your legacy effectively" },
    { icon: PieChart, title: "Investment Portfolios", description: "Personalized portfolios tailored to your goals" },
    { icon: FileText, title: "Insurance Solutions", description: "Comprehensive coverage for peace of mind" },
    { icon: RotateCcw, title: "Portfolio Rebalancing", description: "Keep your investments optimally aligned" },
  ];

  const sportFeatures = [
    { icon: Trophy, title: "NBA Highlights & Debates", description: "Hot takes and analytical breakdowns" },
    { icon: Users, title: "Canadian Ice Hockey", description: "Complete coverage of the Canadian hockey scene" },
    { icon: MessageSquare, title: "Soccer & CEBL Commentary", description: "Canadian sports beyond the big leagues" },
    { icon: BarChart3, title: "Fan Polls & Quick Takes", description: "Join spirited fan conversations" },
  ];

  const blogPosts = [
    {
      title: "How to Build Wealth in 2025",
      category: "Wealth",
      excerpt: "Essential strategies for financial growth in the modern economy.",
      readTime: "5 min read"
    },
    {
      title: "Top 5 Canadian Sports Moments This Year",
      category: "Sport",
      excerpt: "Celebrating the best performances from coast to coast.",
      readTime: "3 min read"
    },
    {
      title: "Should You Incorporate Estate Planning Early?",
      category: "Wealth",
      excerpt: "The benefits of starting your estate planning journey today.",
      readTime: "7 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-background font-poppins">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src={mapleLogoImage} alt="Maple Logo" className="h-10 w-10" />
              <span className="text-xl font-bold text-foreground">Lan Onasis Maple</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: "home", label: "Home" },
                { id: "wealth", label: "Maple Wealth" },
                { id: "sport", label: "Maple Sport" },
                { id: "about", label: "About" },
                { id: "blog", label: "Blog" },
                { id: "book", label: "Book" },
                { id: "contact", label: "Contact" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === item.id ? "text-primary" : "text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* Login Button */}
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/login"}>
                Sign In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-background border-t border-border">
              <div className="py-4 space-y-2">
                {[
                  { id: "home", label: "Home" },
                  { id: "wealth", label: "Maple Wealth" },
                  { id: "sport", label: "Maple Sport" },
                  { id: "about", label: "About" },
                  { id: "blog", label: "Blog" },
                  { id: "book", label: "Book" },
                  { id: "contact", label: "Contact" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-muted transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                
                {/* Mobile Language Switcher */}
                <div className="px-4 py-2">
                  <LanguageSwitcher />
                </div>
                
                {/* Mobile Login Button */}
                <div className="px-4 py-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = "/login"}>
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-background"
          style={{ '--hero-bg': `url(${heroBannerImage})` } as React.CSSProperties}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <img src={mapleLogoImage} alt="Maple Logo" className="h-20 w-20 mx-auto mb-8 animate-pulse" />
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Live Smart. <span className="text-primary">Move Bold.</span> <span className="text-secondary">Grow Wealth.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Welcome to Lan Onasis Maple – your gateway to a lifestyle of financial empowerment and high-energy insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => scrollToSection("wealth")}
                className="text-lg"
              >
                Explore Maple Wealth
              </Button>
              <Button 
                variant="sport" 
                size="xl"
                onClick={() => scrollToSection("sport")}
                className="text-lg"
              >
                Visit Maple Sport
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Maple Wealth Section */}
      <section id="wealth" className="py-20 bg-gradient-to-br from-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              <span className="text-primary">Maple Wealth</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover modern financial solutions tailored to your goals. From personalized investment portfolios to complete estate planning and insurance guidance, Maple Wealth gives you the roadmap to financial wellness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {wealthFeatures.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-primary/20">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="wealth" size="lg">
              Start My Financial Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Maple Sport Section */}
      <section id="sport" className="py-20 bg-gradient-to-br from-sport-red/5 to-sport-blue/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              <span className="text-sport-red">Maple</span> <span className="text-sport-blue">Sport</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get in the game with fresh perspectives on basketball, hockey, and the Canadian sports scene. Dive into hot takes, analytical breakdowns, and spirited fan conversations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {sportFeatures.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-sport-red/20">
                <feature.icon className="h-12 w-12 text-sport-blue mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="sport" size="lg">
              Join the Maple Sports Arena
            </Button>
          </div>
        </div>
      </section>

      {/* About the Maple Movement */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                The <span className="text-primary">Maple Movement</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Founded under the Lan Onasis vision, Maple represents a bold new take on lifestyle empowerment. Whether you're building wealth or diving into sport culture, the Maple movement supports your growth at every step.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                  <span className="text-foreground font-medium">2023: Maple Wealth Foundation</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-sport-red rounded-full"></div>
                  <span className="text-foreground font-medium">2024: Maple Sport Launch</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-sport-blue rounded-full"></div>
                  <span className="text-foreground font-medium">2025: Unified Lifestyle Platform</span>
                </div>
              </div>

              <Button variant="cta" size="lg">
                Become an Advisor
              </Button>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 text-center border-primary/30">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground">Wealth Building</h3>
                </Card>
                <Card className="p-6 text-center border-sport-red/30 mt-8">
                  <Trophy className="h-12 w-12 text-sport-red mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground">Sports Culture</h3>
                </Card>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <img src={mapleLogoImage} alt="Maple Logo" className="h-16 w-16" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Maple */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-sport-blue/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Why Choose <span className="text-primary">Maple</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                At Maple, we believe in empowering individuals through comprehensive financial guidance and passionate sports insights. Our unique dual approach sets us apart in delivering value that matters to your lifestyle.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Personalized Approach</h3>
                    <p className="text-muted-foreground">Every financial plan and sports insight is tailored to your unique goals and interests.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-sport-red rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Expert Knowledge</h3>
                    <p className="text-muted-foreground">Our team combines deep financial expertise with authentic Canadian sports passion.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-sport-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Integrated Lifestyle</h3>
                    <p className="text-muted-foreground">We understand that financial wellness and sports culture both contribute to a fulfilling life.</p>
                  </div>
                </div>
              </div>

              <Button variant="cta" size="lg">
                Start Your Maple Journey
              </Button>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl">
                <img 
                  src="/lovable-uploads/3fb048ed-9049-4158-a3e3-abee806480f9.png" 
                  alt="Maple team member with friendly smile" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background rounded-xl p-4 shadow-xl border border-border">
                <div className="flex items-center space-x-3">
                  <Heart className="h-8 w-8 text-sport-red" />
                  <div>
                    <p className="font-semibold text-foreground">Trusted by</p>
                    <p className="text-sm text-muted-foreground">1000+ Canadians</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog & Resources */}
      <section id="blog" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Insights & <span className="text-primary">Resources</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay informed with the latest insights from both our wealth and sport experts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="p-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                    post.category === "Wealth" ? "bg-primary/20 text-primary" : "bg-sport-red/20 text-sport-red"
                  }`}>
                    {post.category}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{post.title}</h3>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                    <Button variant="link" size="sm">Read More</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg">
              Read All Insights
            </Button>
          </div>
        </div>
      </section>

      {/* Book Appointment */}
      <section id="book" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Book Your <span className="text-primary">Consultation</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to start your financial journey? Schedule a consultation with our expert advisors.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <AppointmentCalendar />
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-secondary text-secondary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img src={mapleLogoImage} alt="Maple Logo" className="h-10 w-10" />
                <span className="text-2xl font-bold">Lan Onasis Maple</span>
              </div>
              <p className="text-secondary-foreground/80 mb-6 max-w-md">
                Empowering your financial future and sports passion through expert insights and personalized guidance.
              </p>
              
              {/* Newsletter */}
              <div className="space-y-4">
                <h4 className="font-semibold">Stay Updated</h4>
                <div className="flex space-x-2">
                  <Input placeholder="Enter your email" className="bg-background text-foreground" />
                  <Button variant="default">Subscribe</Button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {["Home", "Maple Wealth", "Maple Sport", "Blog", "Contact"].map((link) => (
                  <button key={link} className="block text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Get in Touch</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">hello@lanonasismaple.com</span>
                </div>
                
                {/* Social Links */}
                <div className="flex space-x-4 pt-4">
                  <a href="https://www.facebook.com/LanOnasisMaple" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook">
                    <Facebook className="h-5 w-5 text-secondary-foreground/60 hover:text-primary cursor-pointer transition-colors" />
                  </a>
                  <a href="https://www.instagram.com/lanonasismaple" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
                    <Instagram className="h-5 w-5 text-secondary-foreground/60 hover:text-primary cursor-pointer transition-colors" />
                  </a>
                  <a href="https://www.linkedin.com/company/lanonasismaple" target="_blank" rel="noopener noreferrer" aria-label="Connect with us on LinkedIn">
                    <Linkedin className="h-5 w-5 text-secondary-foreground/60 hover:text-primary cursor-pointer transition-colors" />
                  </a>
                  <a href="https://twitter.com/lanonasismaple" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter">
                    <Twitter className="h-5 w-5 text-secondary-foreground/60 hover:text-primary cursor-pointer transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-secondary-foreground/20 pt-8 text-center">
            <p className="text-sm text-secondary-foreground/60">
              © 2025 Lan Onasis Maple. All rights reserved. Live Smart. Move Bold. Grow Wealth.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Assistant Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`transition-all duration-300 ${(showAIAssistant || showAIChat) ? 'mb-4' : ''}`}>
          {showAIChat && (
            <MapleAIChat 
              onClose={() => {
                setShowAIChat(false);
                setShowAIAssistant(false);
              }}
              onBack={() => {
                setShowAIChat(false);
                setShowAIAssistant(true);
              }}
            />
          )}
          
          {showAIAssistant && !showAIChat && (
            <Card className="w-80 p-4 shadow-xl border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">Maple AI Assistant</h4>
                <button 
                  onClick={() => setShowAIAssistant(false)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close AI Assistant"
                  title="Close AI Assistant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                I can help you with questions about Maple Wealth services, booking consultations, becoming an advisor, or sports updates!
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full text-left justify-start">
                  Book a Wealth Consultation
                </Button>
                <Button variant="outline" size="sm" className="w-full text-left justify-start">
                  Become an Advisor
                </Button>
                <Button variant="outline" size="sm" className="w-full text-left justify-start">
                  Latest Sports Updates
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-left justify-start"
                  onClick={() => {
                    setShowAIAssistant(false);
                    setShowAIChat(true);
                  }}
                >
                  Chat with Maple AI
                </Button>
              </div>
            </Card>
          )}
        </div>
        
        <Button
          variant="default"
          size="icon"
          className="h-14 w-14 rounded-full shadow-xl hover:shadow-2xl"
          onClick={() => setShowAIAssistant(!showAIAssistant)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {import.meta.env.DEV && (
        <div className="fixed bottom-6 left-6 z-50">
          <GatewayLoginTester />
        </div>
      )}
    </div>
  );
};

export default Index;