<template>
  <span
    :class="['ln-brandmark', `ln-brandmark-${variant}`, `ln-brandmark-theme-${theme}`]"
    :style="containerStyle"
    :role="onClick ? 'button' : undefined"
    :tabindex="onClick ? 0 : undefined"
    @click="handleClick"
    @keydown="handleKey"
    :aria-label="alt"
  >
    <svg
      :width="px"
      :height="px"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g :fill="inkColor" fill-rule="evenodd" stroke="none">
        <!--
          Geometry transcribed from assets/logos/brandmark-icon.svg (CANONICAL vector).
          No IDs, no <defs>, no <mask> — same rationale as the React BrandMark:
          IDs collide in sprite systems and SVGO will renumber them.
          The aperture is cut geometrically via fill-rule="evenodd".
        -->
        <path d="M32 4 C16 4 4 16 4 32 c0 14 9 25 22 28 v-7 c-9-3-15-11-15-21 0-12 10-22 22-22 s22 10 22 22 c0 4-1 8-3 11 l5 5 c3-5 5-10 5-16 C62 16 48 4 32 4 Z" />
        <circle cx="42" cy="42" r="3" :fill="accentColor" />
      </g>
    </svg>
    <span v-if="showWordmark" class="ln-brandmark-wordmark" :style="{ color: inkColor }">
      LAN Onasis
    </span>
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: { type: String, default: "tile", validator: (v) => ["tile", "icon", "monogram", "wordmark"].includes(v) },
  theme:   { type: String, default: "light", validator: (v) => ["light", "dark"].includes(v) },
  size:    { type: String, default: "md", validator: (v) => ["sm", "md", "lg", "xl", "2xl"].includes(v) },
  alt:     { type: String, default: "LAN Onasis" },
  onClick: { type: Function, default: null },
});

const SIZE = { sm: 24, md: 32, lg: 48, xl: 64, "2xl": 128 };
const INK = { light: "#1B365D", dark: "#FFFFFF" };
const ACCENT = "#00D4AA";

const px = computed(() => SIZE[props.size] || 32);
const inkColor = computed(() => INK[props.theme] || INK.light);
const accentColor = computed(() => ACCENT);
const showWordmark = computed(() => props.variant === "wordmark");

function handleClick(e) { if (props.onClick) props.onClick(e); }
function handleKey(e) { if ((e.key === "Enter" || e.key === " ") && props.onClick) { e.preventDefault(); props.onClick(e); } }
</script>

<style scoped>
.ln-brandmark {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  line-height: 0;
}
.ln-brandmark svg { display: block; }
.ln-brandmark-wordmark {
  font-family: var(--font-display, system-ui);
  font-weight: 700;
  font-size: 1em;
  line-height: 1;
}
</style>
