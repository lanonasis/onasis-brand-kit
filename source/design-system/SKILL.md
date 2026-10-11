---
name: lan-onasis-design
description: Use this skill to generate well-branded interfaces and assets for LAN Onasis, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files. The system is built around three brand colors (navy `#1B365D`, green `#00D4AA`, gold `#FFD700` — gold is logo-only), Plus Jakarta Sans + Inter + JetBrains Mono, and Lucide icons.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out of `assets/` and `colors_and_type.css` into your output, then build static HTML files for the user to view. Reference `ui_kits/web/` for marketing surfaces and `ui_kits/dashboard/` for product surfaces.

If working on production code, copy `colors_and_type.css` (or just the `:root` token block) and the logo SVGs, then read the rules in `README.md` to become an expert in designing with this brand. The CONTENT FUNDAMENTALS and VISUAL FOUNDATIONS sections cover voice, hover/press states, motion, shadow, radii, and layout — quote them when answering "how should this look?" questions.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions about audience and surface (marketing site? dashboard? slide deck?), and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
