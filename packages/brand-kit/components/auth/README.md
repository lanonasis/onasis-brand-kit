# Lanonasis Auth Components - Brand Kit

Professional authentication components for the Lanonasis platform ecosystem.

## Components

### AuthForm
Professional authentication form with OAuth provider support.

**Features:**
- ✅ Email/password authentication
- ✅ 5 OAuth providers (Google, GitHub, LinkedIn, Discord, Apple)
- ✅ Form validation with error handling
- ✅ Password visibility toggle
- ✅ Toast notifications
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Central auth integration (api.lanonasis.com)

**OAuth Providers:**
- **Google** (Primary)
- **GitHub** (Primary) 
- **LinkedIn** (Secondary)
- **Discord** (Secondary)
- **Apple** (Secondary)

### AuthPage
Complete authentication page with background and branding.

**Features:**
- ✅ Gradient background with branded styling
- ✅ Logo and platform branding
- ✅ Security badge
- ✅ Responsive design
- ✅ Mode switching (login/register/forgot-password)

### Social Provider Icons
SVG icons for OAuth providers with proper colors and styling.

**Included:**
- GoogleIcon
- GitHubIcon
- LinkedInIcon
- DiscordIcon
- AppleIcon
- MicrosoftIcon

## Usage

```tsx
import { AuthPage } from '@lanonasis/brand-kit/components/auth/AuthPage';
import { AuthForm } from '@lanonasis/brand-kit/components/auth/AuthForm';

// Full page authentication
<AuthPage />

// Embedded form
<AuthForm 
  mode="login" 
  className="custom-styling"
/>
```

## Central Authentication Flow

All forms redirect to `api.lanonasis.com/auth/*` for centralized authentication:

- **Email/Password**: `/auth/login` or `/auth/signup`
- **OAuth**: `/auth/oauth?provider={provider}`
- **Forgot Password**: `/auth/forgot-password`

Platform detection automatically handles different user types:
- `platform=dashboard` - Business users
- `platform=cli` - Developers
- `platform=mcp` - MCP integrations

## Design Philosophy

### Professional vs Technical
- **Professional Form**: Clean, accessible, business-friendly
- **Terminal Form**: Developer-focused, hacker aesthetic
- **Same Backend**: Unified authentication service

### Brand Consistency
- Lanonasis gradient backgrounds
- Professional typography
- Consistent spacing and colors
- Security-focused messaging

## Dependencies

- React 18+
- Lucide React (icons)
- Tailwind CSS (styling)
- TypeScript (type safety)

## Accessibility Features

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- High contrast colors
- Focus indicators
- Error announcements

## Security Features

- SSL encryption badge
- Secure redirects to central auth
- No direct credential handling
- Platform-specific redirects
- Toast feedback for user actions

## Integration

These components are designed to work across the Lanonasis ecosystem:

- **lanonasis-index**: Main platform landing
- **dashboard**: Business user interface  
- **docs**: Documentation sites
- **Any Lanonasis app**: Consistent auth experience

## Customization

Components accept className props for custom styling while maintaining brand consistency.