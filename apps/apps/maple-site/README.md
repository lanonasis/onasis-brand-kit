# 🍁 Lan Onasis Maple

**Live Smart. Move Bold. Grow Wealth.**

A modern digital platform combining cutting-edge financial solutions with passionate sports insights, serving clients across Canada, United States, United Kingdom, and Nigeria.

![Maple Logo](src/assets/maple-logo.png)

## 🌟 About

Lan Onasis Maple represents the perfect fusion of financial expertise and sports passion. We provide comprehensive wealth management services while delivering engaging content for sports enthusiasts, particularly focusing on Canadian basketball, NBA, and hockey.

### 🏢 Services Offered

**Financial Solutions:**
- 💰 **Personalized Investment Portfolios** - Tailored investment strategies aligned with your goals
- 📊 **Portfolio Rebalancing** - Dynamic portfolio optimization for maximum returns
- 🏠 **Estate Planning** - Comprehensive estate and legacy planning services
- 🛡️ **Insurance Solutions** - Complete insurance guidance and protection strategies
- 📈 **Wealth Management** - Holistic financial planning and wealth growth strategies

**Sports Content:**
- 🏀 **Basketball Coverage** - NBA analysis and Canadian basketball insights
- 🏒 **Hockey Analysis** - Professional hockey coverage and commentary
- 🎯 **CEBL Coverage** - Canadian Elite Basketball League insights
- 📺 **Sports Entertainment** - Engaging sports content and analysis

## 🌍 Geographic Reach

We proudly serve clients in:
- 🇨🇦 **Canada** - Our home base with deep local expertise
- 🇺🇸 **United States** - Comprehensive North American coverage
- 🇬🇧 **United Kingdom** - European market expansion
- 🇳🇬 **Nigeria** - Growing African market presence

## 🚀 Features

### Interactive Components
- **📅 Appointment Booking System** - Easy consultation scheduling
- **💬 Contact Forms** - Multiple communication channels
- **📱 Responsive Design** - Seamless experience across all devices
- **🎨 Modern UI** - Beautiful, intuitive user interface

### Technical Highlights
- **⚡ Fast Performance** - Built with Vite and modern React
- **📱 Mobile-First** - Optimized for mobile and tablet users
- **🔍 SEO Optimized** - Comprehensive search engine optimization
- **♿ Accessible** - WCAG compliant accessibility features

## 🛠️ Technologies Used

### Frontend Stack
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible UI components

### Additional Libraries
- **Lucide React** - Beautiful SVG icons
- **React Hook Form** - Efficient form handling
- **React Router DOM** - Client-side routing
- **Date-fns** - Modern date utility library
- **React Query** - Server state management

### Backend Services
- **Supabase** - Backend-as-a-Service platform
- **Authentication** - Secure user authentication
- **Database** - PostgreSQL with real-time features
- **Storage** - File upload and management

## 🎯 Key Sections

### Landing Page Components
1. **Hero Section** - Compelling value proposition with CTAs
2. **About Section** - Company mission and expertise
3. **Services Grid** - Detailed service offerings
4. **Why Choose Maple** - Unique value propositions
5. **Appointment Booking** - Interactive calendar system
6. **Contact Information** - Multiple contact methods

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd maple-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Configure your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:8080
   ```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (shadcn/ui)
│   └── AppointmentCalendar.tsx
├── pages/               # Page components
│   ├── Index.tsx        # Main landing page
│   └── NotFound.tsx     # 404 error page
├── assets/              # Static assets
│   ├── maple-logo.png   # Company logo
│   └── hero-banner.jpg  # Hero section image
├── integrations/        # Third-party integrations
│   └── supabase/        # Supabase configuration
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
└── styles/              # Global styles
```

## 🔧 Development

### Code Style
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking
- **Prettier** - Code formatting (configured via ESLint)

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checking
```

## 🌐 Deployment

### Lovable Platform
The easiest way to deploy is through [Lovable](https://lovable.dev):
1. Open your project in Lovable
2. Click on "Share" → "Publish"
3. Your site will be deployed instantly

### Custom Domain
Connect a custom domain through:
1. Project Settings → Domains
2. Follow the DNS configuration steps
3. SSL certificates are handled automatically

### Alternative Hosting
The built application can be deployed to any static hosting service:
- **Vercel** - Recommended for React applications
- **Netlify** - Great for static sites with forms
- **AWS S3 + CloudFront** - Scalable enterprise solution
- **GitHub Pages** - Free hosting for open source projects

## 📞 Contact & Support

### Business Inquiries
- **Website**: [maple.lanonasis.com](https://maple.lanonasis.com)
- **Email**: info@lanonasis.com
- **Phone**: Available through appointment booking

### Social Media
- **Facebook**: [@LanOnasisMaple](https://www.facebook.com/LanOnasisMaple)
- **Instagram**: [@lanonasismaple](https://www.instagram.com/lanonasismaple)
- **Twitter**: [@lanonasismaple](https://twitter.com/lanonasismaple)

## 📋 Roadmap

### Upcoming Features
- [ ] **Client Portal** - Secure client dashboard
- [ ] **Real-time Portfolio Tracking** - Live investment updates
- [ ] **Sports Blog Platform** - Editorial content management
- [ ] **Mobile Application** - Native iOS and Android apps
- [ ] **Multi-language Support** - French and other languages
- [ ] **Video Consultation** - Integrated video calling
- [ ] **Document Upload** - Secure document sharing
- [ ] **Automated Reporting** - Scheduled financial reports

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting pull requests.

### Development Guidelines
1. Follow TypeScript best practices
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation as needed
5. Ensure accessibility compliance

## 📄 License

This project is proprietary software owned by Lan Onasis Maple. All rights reserved.

## 🙏 Acknowledgments

- **Shadcn/ui** - For the beautiful component library
- **Lucide** - For the comprehensive icon set
- **Tailwind CSS** - For the utility-first CSS framework
- **Supabase** - For the robust backend platform
- **Lovable** - For the innovative development platform

---

**Built with ❤️ by the Lan Onasis Maple team**

*Live Smart. Move Bold. Grow Wealth.*

🍁 **Maple - Where Finance Meets Passion** 🍁