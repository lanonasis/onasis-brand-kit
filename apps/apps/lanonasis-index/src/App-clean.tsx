import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { HeroSection } from './components/HeroSection';
import { Features } from './components/Features';
import { DisplayCardsDemo } from './components/DisplayCardsDemo';
import { LogoCarouselDemo } from './components/LogoCarouselDemo';
import { PricingTable } from './components/PricingTable';
import { Testimonials } from './components/Testimonials';
import { CallToAction } from './components/CallToAction';
import { LanguageSwitcher } from './components/LanguageSwitcher';

function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-primary text-white">
      <Helmet>
        <title>{t('app.title')}</title>
        <meta name="description" content={t('app.description')} />
        <meta name="keywords" content="African fintech, AI technology, compliance automation, risk management, B2B payments, business intelligence" />
      </Helmet>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-secondary">Lan Onasis</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-secondary transition-colors">Features</a>
              <a href="#ecosystem" className="text-gray-300 hover:text-secondary transition-colors">Ecosystem</a>
              <a href="#pricing" className="text-gray-300 hover:text-secondary transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-300 hover:text-secondary transition-colors">Testimonials</a>
              <a href="https://dashboard.lanonasis.com/" className="btn-primary text-sm px-4 py-2">Get Started</a>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Platform Features */}
        <section id="features">
          <Features />
        </section>
        
        {/* Platform Demo */}
        <DisplayCardsDemo />
        
        {/* Logo Carousel */}
        <section id="ecosystem">
          <LogoCarouselDemo />
        </section>
        
        {/* Pricing */}
        <section id="pricing">
          <PricingTable />
        </section>
        
        {/* Testimonials */}
        <section id="testimonials">
          <Testimonials />
        </section>
        
        {/* Call to Action */}
        <CallToAction />
      </main>

      {/* Footer */}
      <footer className="bg-primary-dark border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold text-secondary mb-4">Lan Onasis</h3>
              <p className="text-gray-400 mb-4">
                Transforming Africa's financial technology landscape with AI-powered solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-secondary transition-colors">GitHub</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-secondary transition-colors">VortexCore AI</a></li>
                <li><a href="#" className="text-gray-400 hover:text-secondary transition-colors">VortexPay</a></li>
                <li><a href="#" className="text-gray-400 hover:text-secondary transition-colors">BizGenie</a></li>
                <li><a href="#" className="text-gray-400 hover:text-secondary transition-colors">API Gateway</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="https://docs.lanonasis.com" className="text-gray-400 hover:text-secondary transition-colors">Documentation</a></li>
                <li><a href="https://dashboard.lanonasis.com" className="text-gray-400 hover:text-secondary transition-colors">Dashboard</a></li>
                <li><a href="#" className="text-gray-400 hover:text-secondary transition-colors">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-secondary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 Lan Onasis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
