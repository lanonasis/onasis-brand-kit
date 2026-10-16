# LAN Onasis design system

## Identity and scope
This locally authored React library translates the LAN Onasis handoff into reusable components and tokens. The brand has two complementary expressions: corporate uses a gold emblem on deep navy; product uses navy, white, and green. Keep those roles distinct while composing a unified experience. Use the supplied logos, never draw substitutes. The full token source is the canonical theme; published token and component references are regenerated from the extraction inputs.

The uploaded token stylesheet is the working source for the draft, cross-checked against https://github.com/lanonasis/onasis-brand-kit and @lanonasis/brand-kit. Include the newer semantic aliases without changing the draft's local source classification. Its sampled gold differs from the older brand usage guide's logo gold. Keep the working corporate gold token for interfaces; preserve the original bytes and colors of every logo. Font roles are equally intentional: Cormorant Garamond for corporate expression, Plus Jakarta Sans for product headings, Inter for body/interface, and JetBrains Mono for code and identifiers. Do not use the brand serif for ordinary product interface text.

## Setup
The file-copy library is self-contained under its design-system folder; original assets and locally hosted font files are carried under assets. Import the canonical theme once in the consumer's global CSS entry. The theme supplies font-face rules, tokens, component recipes, semantic typography, and dark-theme overrides. Keep its relative font URLs intact. Reusable components have no dependency on preview navigation or showcase routes.

```tsx
import { Button, Input, Badge } from '@/design-system/lan-onasis';

<label>
  Workspace name
  <Input name="workspace" placeholder="Acme Africa" />
</label>
<Button variant="accent" onClick={createWorkspace}>Create workspace</Button>
<Badge tone="success">Operational</Badge>
```

Use the barrel for public APIs, and import the attached theme at its actual copied path. Runtime dependencies include React, React DOM, clsx, lucide-react, and Radix Dialog; retain these when consuming the library. This library is CSS-variable based, not a Tailwind library. Do not introduce a second framework just to reproduce its recipes. The theme can be used alongside a consumer's existing styling stack.

## Token discipline
Every color, spacing, type, radius, and elevation choice must come from the theme's named variables. Use semantic surfaces and foregrounds rather than raw palette values when building interface chrome. Fixed variants provide component appearance; className is an extension point for layout and composition, not a replacement theme. No raw hex or RGB values in page code. Do not mutate brand assets to make them match a different theme. Data-driven swatch examples may bind an actual token name through a CSS custom property; ordinary pages should use named recipes.

Use the supplied spacing rhythm, restrained elevation, and clearly divided page regions. Do not put page sections into floating decorative cards or nest cards for layout. Reserve cards for repeated entities or genuinely framed tools. Components use the medium radius by default; larger radii remain available as foundational tokens, not a reason to make all controls pill-shaped. Keep letter spacing neutral across the interface. Show whitespace and hierarchy through spacing and type, not ornament.

## Component APIs
Button preserves primary (corporate gold), accent (product green), secondary (navy), outline, and ghost, adding danger for destructive actions. Use fixed sizes and loading for asynchronous actions. Badge preserves tone and optional status dot. Card preserves eyebrow, title, body, accent, and footer while accepting children. Prefer composition over copying recipes into another component.

Input and Select are semantic form controls: their labels and help/error descriptions belong in the consuming form. Use error variant with aria-describedby pointing at an actionable error message. Modal uses Radix Dialog for focus containment, Escape dismissal, and focus restoration. Always provide a meaningful title and an explanation when the dialog changes data.

Dashboard patterns receive data and callbacks. Marketing patterns receive content, links, and actions. They are interface patterns, not backend implementations. Do not claim live data, security certification, uptime guarantees, regional availability, payment totals, or user permissions based on the example specimens. Pass verified production data from the consuming application's own system.

## Accessibility and behavior
Use buttons for actions, anchors for navigation, labels linked to controls, and genuine tables for tabular data. Icon-only actions need accessible names and descriptive hover titles. Retain visible focus rings; do not remove outlines. All menu and dialog actions must be keyboard reachable. Provide alt text for meaningful logos and imagery; decorative imagery uses empty alternative text.

Use foreground tokens on their intended surfaces, and check contrast in both themes. Status must be communicated with text, not only a dot or color. Disabled controls remain visually recognizable and are truly disabled. Keep loading content stable. Avoid animations that are essential for comprehension; reduced-motion preference suppresses transitions and spin. Never hide overflow that makes a label unreadable.

## Voice and content
Write direct sentence-case labels. Avoid emoji, empty buzzwords, generic filler, or inflated claims. Use plausible task-specific content, but distinguish sample records from real records. Corporate pages may feel formal; product pages should feel clear and efficient. Both should sound assured rather than promotional.

## Consumer updates
Attached libraries are snapshots. Editing this library does not instantly update existing consumers; publish a new version and accept its update in each consuming project. Keep the public barrel and extraction sources synchronized whenever components move or APIs change. Never hand-edit generated reference files in rules; enrich components through the schema and update narrative rules here.
