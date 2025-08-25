"use client"

import { LogoCarousel } from './ui/logo-carousel'
import '../components/ui/logo-carousel.css'

// Financial Institution Partners
const financialPartners = [
  {
    src: "https://cdn.cdnlogo.com/logos/e/57/ecobank.svg",
    alt: "Ecobank",
    href: "https://ecobank.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/f/38/first-bank-nigeria.svg", 
    alt: "First Bank Nigeria",
    href: "https://firstbanknigeria.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/s/84/standard-chartered.svg",
    alt: "Standard Chartered",
    href: "https://standardchartered.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/m/17/mtn.svg",
    alt: "MTN Group",
    href: "https://mtn.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/a/26/access-bank.svg",
    alt: "Access Bank",
    href: "https://accessbankplc.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/s/96/safaricom.svg",
    alt: "Safaricom",
    href: "https://safaricom.co.ke"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/g/95/guaranty-trust-bank.svg",
    alt: "Guaranty Trust Bank",
    href: "https://gtbank.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/a/17/absa.svg",
    alt: "Absa Group",
    href: "https://absa.africa"
  }
]

// Technology Partners
const techPartners = [
  {
    src: "https://cdn.cdnlogo.com/logos/s/96/stripe.svg",
    alt: "Stripe",
    href: "https://stripe.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/p/29/paypal.svg",
    alt: "PayPal", 
    href: "https://paypal.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/o/56/openai.svg",
    alt: "OpenAI",
    href: "https://openai.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/s/91/supabase.svg",
    alt: "Supabase",
    href: "https://supabase.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/g/69/github.svg",
    alt: "GitHub",
    href: "https://github.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/v/84/vercel.svg",
    alt: "Vercel",
    href: "https://vercel.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/a/88/anthropic.svg",
    alt: "Anthropic",
    href: "https://anthropic.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/a/13/amazon-web-services.svg",
    alt: "Amazon AWS",
    href: "https://aws.amazon.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/m/44/microsoft-azure.svg",
    alt: "Microsoft Azure",
    href: "https://azure.microsoft.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/s/75/slack.svg",
    alt: "Slack",
    href: "https://slack.com"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/n/53/notion.svg",
    alt: "Notion",
    href: "https://notion.so"
  },
  {
    src: "https://cdn.cdnlogo.com/logos/f/30/figma.svg",
    alt: "Figma",
    href: "https://figma.com"
  }
]

export function LogoCarouselDemo() {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Powering innovation with leading financial institutions and technology companies across Africa and globally
          </p>
        </div>
        
        <div className="space-y-12">
          {/* Financial Partners */}
          <div>
            <h3 className="text-2xl font-semibold text-white text-center mb-8">Financial Institutions</h3>
            <LogoCarousel 
              logos={financialPartners} 
              speed={30} 
              pauseOnHover={true}
            />
          </div>
          
          {/* Technology Partners */}
          <div>
            <h3 className="text-2xl font-semibold text-white text-center mb-8">Technology Partners</h3>
            <LogoCarousel 
              logos={techPartners} 
              speed={25} 
              pauseOnHover={true}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
