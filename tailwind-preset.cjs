/**
 * LAN Onasis product-surface tokens for Tailwind 3 consumers.
 * The CSS variables remain the source of truth; this preset deliberately
 * maps utilities to those variables instead of duplicating hex values.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        ln: {
          navy: 'var(--ln-navy)',
          'navy-deep': 'var(--ln-navy-deep)',
          green: 'var(--ln-green)',
          gold: 'var(--ln-gold)',
          surface: 'var(--bg)',
          subtle: 'var(--bg-subtle)',
          text: 'var(--fg-1)',
          muted: 'var(--fg-2)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        ln: 'var(--r-lg)',
      },
      boxShadow: {
        ln: 'var(--shadow-sm)',
        'ln-hover': 'var(--shadow-md)',
      },
    },
  },
};
