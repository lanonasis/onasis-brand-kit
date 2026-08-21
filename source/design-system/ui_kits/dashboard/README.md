# Dashboard Kit · LAN Onasis (VortexCore)

Hi-fi recreation of a SaaS product surface — the operational console for VortexCore AI / Memory as a Service.

## What's here

- `index.html` — full app shell with sidebar nav, top bar, and a click-thru between three views (Overview, Memories, Settings).
- `Sidebar.jsx` — collapsible nav with workspace switcher + product sections.
- `TopBar.jsx` — search, region badge, notifications, avatar.
- `KpiRow.jsx` — 4-up KPI cards with sparkline.
- `ChartCard.jsx` — area chart card (synthetic data).
- `MemoriesTable.jsx` — table with status pills, region, owner, search.
- `SettingsPane.jsx` — API keys + region + danger zone.
- `EmptyState.jsx`, `Modal.jsx` — utility components.

## Visual rules followed

- Light mode primary; sidebar is white with `--bg-subtle` rail.
- Type: Plus Jakarta Sans for headings, Inter for body, JetBrains Mono for keys/IDs.
- Status pills use semantic tokens (green/amber/red), never raw colors.
- Tables: horizontal rows, no zebra. Hover background `--ln-navy-50`.
- Modal: 12 px radius, `shadow-lg`, scrim at navy/40.
- All numbers monospace-tabular.

## Click-thru

Sidebar items switch the main view. Search filters the table. "Generate key" in Settings opens a modal that returns a fake new key and closes.
