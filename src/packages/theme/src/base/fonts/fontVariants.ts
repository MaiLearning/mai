import './var1.css'
import './var2.css'
import './var3.css'

/** Шрифт внутри варианта: id для селектора витрины и CSS-семейство из @font-face. */
export interface GalleryFont {
  /** Короткий id ('inter', 'jetbrains-mono', ...). */
  id: string
  /** Человекочитаемое имя семейства. */
  label: string
  /** CSS font-family, подключённая @font-face этого пакета. */
  family: string
}

/**
 * Вариант шрифтовой пары (sans + mono) — содержимое одной папки varN.
 * Новый вариант: папка varN/, varN.css с @font-face и запись ниже.
 */
export interface FontVariant {
  /** Id варианта: 'var1', 'var2', ... */
  id: string
  /** Подпись варианта для сетки сравнения. */
  label: string
  sans: GalleryFont
  mono: GalleryFont
}

export const fontVariants: FontVariant[] = [
  {
    id: 'var1',
    label: 'var1 — Inter + JetBrains Mono',
    sans: { id: 'inter', label: 'Inter', family: 'Inter' },
    mono: { id: 'jetbrains-mono', label: 'JetBrains Mono', family: 'JetBrains Mono' },
  },
  {
    id: 'var2',
    label: 'var2 — Manrope + Fira Code',
    sans: { id: 'manrope', label: 'Manrope', family: 'Manrope' },
    mono: { id: 'fira-code', label: 'Fira Code', family: 'Fira Code' },
  },
  {
    id: 'var3',
    label: 'var3 — Golos Text + IBM Plex Mono',
    sans: { id: 'golos-text', label: 'Golos Text', family: 'Golos Text' },
    mono: { id: 'ibm-plex-mono', label: 'IBM Plex Mono', family: 'IBM Plex Mono' },
  },
]

/** Все sans-варианты — опции селектора витрины. */
export const sansFonts: GalleryFont[] = fontVariants.map((v) => v.sans)

/** Все mono-варианты — опции селектора витрины. */
export const monoFonts: GalleryFont[] = fontVariants.map((v) => v.mono)

/** Резолвит id шрифта в CSS-семейство; неизвестный id — generic fallback. */
export function resolveFontFamily(id: string, fonts: GalleryFont[]): string {
  return fonts.find((f) => f.id === id)?.family ?? 'sans-serif'
}
