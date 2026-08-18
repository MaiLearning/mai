/**
 * Настройки типографии приложения.
 * Sora — display шрифт (headings, brand).
 * Plus Jakarta Sans — body шрифт (текст, UI).
 */
export const typography = {
  fontFamilyDisplay: 'Sora, ui-sans-serif, system-ui, sans-serif',
  fontFamilyBody: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif',
  fontFamily: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, Fira Code, monospace',
  headings: {
    fontFamily: 'Sora, ui-sans-serif, system-ui, sans-serif',
    fontWeight: '700',
    textWrap: 'wrap' as const,
    sizes: {
      h1: { fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2' },
      h2: { fontSize: '2rem', fontWeight: '700', lineHeight: '1.25' },
      h3: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.3' },
      h4: { fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.35' },
      h5: { fontSize: '1rem', fontWeight: '500', lineHeight: '1.4' },
      h6: { fontSize: '0.875rem', fontWeight: '500', lineHeight: '1.4' },
    },
  },
} as const
