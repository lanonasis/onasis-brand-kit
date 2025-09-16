# Lan-Onasis Mobile App Design Guidelines

## Design Philosophy
Our mobile apps should reflect our core values of innovation, security, and seamless integration while maintaining a distinctly African perspective on financial technology.

## Brand Elements

### Color System
**Primary Colors**
- Navy (#1B365D): Primary backgrounds, headers
- Green (#00D4AA): CTAs, success states
- Gold (#FFD700): Premium features, highlights

**Secondary Colors**
- Light Grey (#F4F4F4): Backgrounds, cards
- Dark Grey (#333333): Text, icons
- White (#FFFFFF): Content areas

**Semantic Colors**
- Success: #28A745
- Warning: #FFC107
- Error: #DC3545
- Info: #17A2B8

### Typography

**iOS**
- Primary: SF Pro Text
- Secondary: SF Pro Display
- Monospace: SF Mono (for code/numbers)

**Android**
- Primary: Roboto
- Secondary: Roboto Condensed
- Monospace: Roboto Mono

### Icons & Imagery

**App Icons**
- Master icon in vector format
- Adaptive icon support for Android
- All required sizes for iOS
- Consistent branding across platforms

**System Icons**
- Line weight: 2px
- Corner radius: 2px
- Padding: 8px
- Export formats: PDF, SVG

## UI Components

### Navigation
**Bottom Navigation**
- Home
- Analytics
- Transactions
- Settings

**Top Navigation**
- Back button
- Screen title
- Action buttons

### Common Elements
**Buttons**
- Primary: Filled, brand green
- Secondary: Outlined, navy
- Tertiary: Text-only, contextual

**Cards**
- Elevation: 2dp
- Corner radius: 8px
- Padding: 16px

**Lists**
- Single line: 48px height
- Double line: 72px height
- Avatar size: 40x40px

## Interaction Design

### Touch Targets
- Minimum size: 44x44pt (iOS), 48x48dp (Android)
- Padding between elements: 8px
- Edge margins: 16px

### Gestures
- Swipe to refresh
- Pull to reveal
- Long press for context menus
- Double tap to like/favorite

### Animations
- Duration: 300ms
- Easing: Ease-in-out
- Loading states: Branded spinners
- Transitions: Smooth, purposeful

## Features & Functionality

### Authentication
- Biometric login
- 2FA implementation
- Session management
- Security timeout

### Data Display
**Charts & Graphs**
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distribution
- Custom branded visualizations

**Tables & Lists**
- Sortable columns
- Search/filter capability
- Pagination controls
- Export options

### Forms & Input
- Clear validation
- Inline error messages
- Auto-complete where appropriate
- Progressive disclosure

## Platform-Specific Guidelines

### iOS
**Navigation**
- Large titles
- Back gesture
- Modal sheets

**UI Elements**
- Native components
- System fonts
- Dynamic Type support

### Android
**Navigation**
- Material Design 3
- Bottom sheet dialogs
- FAB implementation

**UI Elements**
- Material components
- Adaptive layouts
- Dark theme support

## Accessibility

### Standards
- WCAG 2.1 AA compliance
- VoiceOver/TalkBack support
- Dynamic Type/font scaling
- High contrast mode

### Implementation
- Semantic markup
- Clear focus states
- Alternative text
- Color contrast ratios

## App Architecture

### File Structure
```
app/
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/
├── components/
│   ├── common/
│   ├── forms/
│   └── charts/
└── screens/
    ├── auth/
    ├── dashboard/
    └── settings/
```

### Performance
- Image optimization
- Lazy loading
- Cache management
- Offline support

## Quality Assurance

### Testing Checklist
- UI consistency
- Responsive layouts
- Platform compliance
- Performance metrics
- Security standards
- Accessibility requirements

### Device Support
- iOS 14+
- Android 8.0+
- Tablet optimization
- Adaptive layouts

## Documentation

### Technical
- API integration guide
- Component library
- State management
- Security protocols

### Design
- Sketch/Figma files
- Component specs
- Animation guidelines
- Icon library

## Release Process

### Versioning
- Semantic versioning
- Change documentation
- Migration guides
- Feature flags

### App Store Guidelines
- Screenshots
- App preview videos
- Feature highlights
- Release notes

## Brand Integration

### White Label Support
- Configurable themes
- Partner branding
- Custom colors
- Logo placement

### Partner Guidelines
- Integration specs
- Brand requirements
- Quality standards
- Review process
