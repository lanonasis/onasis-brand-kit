import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { ArrowRight, Zap, Shield, DollarSign, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './hero-section.css';

interface HeroSectionProps {
  companyName?: string;
  platformName?: string;
  tagline?: string;
  description?: string;
}

const LanOnasisHero: React.FC<HeroSectionProps> = ({
  companyName,
  platformName,
  tagline,
  description
}) => {
  const { t } = useTranslation();
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    { icon: Zap, text: t('hero_section.features.vortexcore_ai') },
    { icon: Shield, text: t('hero_section.features.compliance_tech') },
    { icon: DollarSign, text: t('hero_section.features.financial_services') },
    { icon: Globe, text: t('hero_section.features.digital_ecosystem') }
  ];

  useEffect(() => {
    // Animate SVG paths
    document.querySelectorAll('.animation-line').forEach(path => {
      const len = (path as SVGPathElement).getTotalLength();
      (path as HTMLElement).style.strokeDasharray = `${len}px`;
      (path as HTMLElement).style.strokeDashoffset = `${len}px`;
      
      setTimeout(() => {
        (path as HTMLElement).style.transition = 'stroke-dashoffset 3s ease-in-out';
        (path as HTMLElement).style.strokeDashoffset = '0px';
      }, 1000);
    });

    // Cycle through features
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Blue Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px] bg-blue-500/20 animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[80px] bg-blue-400/15 animate-float"></div>
          <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full blur-[60px] bg-blue-600/10 animate-pulse-slow pulse-delay-1000"></div>
          
          {/* Circuit Pattern */}
          <div className="absolute inset-0 opacity-10 animate-circuit">
            <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_50px,rgba(59,130,246,0.1)_50px,rgba(59,130,246,0.1)_52px)] bg-[repeating-linear-gradient(0deg,transparent,transparent_50px,rgba(59,130,246,0.1)_50px,rgba(59,130,246,0.1)_52px)]"></div>
          </div>
        </div>

        {/* Animated SVG Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path 
              className="animation-line" 
              d="M0 400 Q300 200 600 400 T1200 400"
            />
            <path 
              className="animation-line delay-path-500" 
              d="M0 200 Q400 100 800 300 Q1000 400 1200 200"
            />
            <path 
              className="animation-line delay-path-1000" 
              d="M200 0 Q400 200 600 100 Q800 0 1000 200 Q1100 300 1200 100"
            />
          </svg>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 py-20 min-h-screen flex items-center">
          <div className="max-w-6xl mx-auto text-center">
            {/* Company Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 animate-fadeInUp">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-400">{companyName || t('app.name')}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fadeInUp delay-200">
              <span className="block mb-2">{t('hero_section.transforming')}</span>
              <span className="gradient-text block">{t('hero_section.africas_tech')}</span>
              <span className="block">{t('hero_section.ecosystem')}</span>
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fadeInUp delay-400">
              {tagline || t('hero_section.tagline')}
            </p>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-fadeInUp delay-600">
              {description || t('hero_section.description')}
            </p>

            {/* Feature Showcase */}
            <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fadeInUp delay-800">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = index === currentFeature;
                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-500 ${
                      isActive 
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 glow-effect' 
                        : 'bg-background/50 border-border text-muted-foreground hover:border-blue-500/30'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                    <span className="font-medium">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp delay-1000">
              <Button 
                size="lg" 
                className="group relative px-8 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full glow-effect hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  {t('hero_section.explore_platform', { platformName: platformName || 'VortexCore AI' })}
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-300"
              >
                {t('hero_section.learn_more')}
              </Button>
            </div>

            {/* Stats or Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fadeInUp delay-1200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                <div className="text-muted-foreground">{t('hero_section.stats.african_markets')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">1M+</div>
                <div className="text-muted-foreground">{t('hero_section.stats.transactions_processed')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
                <div className="text-muted-foreground">{t('hero_section.stats.uptime_guarantee')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { LanOnasisHero as HeroSection };
