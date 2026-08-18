/**
 * @font-face декларации для шрифтов приложения.
 * Шрифты размещены в public/fonts/ как bundled woff2.
 *
 * Sora — display шрифт (headings, brand)
 * Plus Jakarta Sans — body шрифт (текст, UI)
 */
export const fontFaces = `
  @font-face {
    font-family: 'Sora';
    font-style: normal;
    font-weight: 500 700;
    font-display: swap;
    src: url('/fonts/Sora-Variable.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-style: normal;
    font-weight: 400 700;
    font-display: swap;
    src: url('/fonts/PlusJakartaSans-Variable.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-style: normal;
    font-weight: 400 700;
    font-display: swap;
    src: url('/fonts/PlusJakartaSans-CyrillicExt.woff2') format('woff2');
    unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
  }
`
