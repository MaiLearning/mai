/**
 * Настройки типографии приложения.
 * Эти токены принадлежат теме styled-components.
 */
export const typography = {
  fontFamily: 'JetBrains Mono, Fira Code, monospace',
  fontFamilyMonospace: 'JetBrains Mono, monospace',
  headings: {
    fontFamily: 'JetBrains Mono, Fira Code, monospace',
    fontWeight: '700',
    textWrap: 'wrap',
    sizes: {
      h1: { fontSize: '2rem', fontWeight: '700', lineHeight: '1.3' },
      h2: { fontSize: '1.75rem', fontWeight: '700', lineHeight: '1.35' },
      h3: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.4' },
      h4: { fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.4' },
      h5: { fontSize: '1rem', fontWeight: '500', lineHeight: '1.5' },
      h6: { fontSize: '0.875rem', fontWeight: '500', lineHeight: '1.5' },
    },
  },
} as const
