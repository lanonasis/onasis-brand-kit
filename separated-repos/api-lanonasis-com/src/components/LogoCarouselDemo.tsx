"use client"

import { LogoCarousel } from './ui/logo-carousel'
import '../components/ui/logo-carousel.css'

// Sample logos - you'll want to replace these with actual partner/client logos
const partnerLogos = [
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

export function LogoCarouselDemo() {
  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Our Trusted Partners</h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
          Working with leading financial institutions and technology companies across Africa to transform the digital landscape.
        </p>
        
        <div className="max-w-7xl mx-auto">
          <LogoCarousel 
            logos={partnerLogos} 
            speed={40} 
            pauseOnHover={true}
          />
        </div>
      </div>
    </section>
  )
}
