import type { AppTheme, ColorScale } from '../../theme'
import { createThemeUtils } from '../../utils'
import { base } from './base'
import { contrastText, state, steps } from './steps'

/**
 * Нейтральная шкала. Ступени 1–3 — бывшие композиты поверхности
 * (body/surface/raised) и фон страницы, 4 — поп-ап слой: за счёт того,
 * что все они выражены ступенями одной шкалы, elevation работает
 * одинаково для любой роли.
 */
const neutral: ColorScale = [
  '#090b10',
  '#0d1322',
  '#162032',
  '#222326',
  '#292a2e',
  '#393a40',
  '#46474f',
  '#5a5b66',
  '#6c6e79',
  '#797b86',
  '#b2b3bd',
  '#eeeef0',
]

const accent: ColorScale = [
  '#14121f',
  '#1b1525',
  '#291f43',
  '#33255b',
  '#3c2e69',
  '#473876',
  '#56468b',
  '#6958ad',
  '#6e56cf',
  '#7d66d9',
  '#baa7ff',
  '#e2ddfe',
]

const success: ColorScale = [
  '#0e1512',
  '#0f1b14',
  '#12291b',
  '#123b24',
  '#164a2d',
  '#1b5a38',
  '#246b45',
  '#2f7f52',
  '#30a46c',
  '#2b9a66',
  '#3dd68c',
  '#b1f1cb',
]

const warning: ColorScale = [
  '#16120c',
  '#1d180f',
  '#302008',
  '#452e0b',
  '#573b0c',
  '#694a0d',
  '#805b10',
  '#976d13',
  '#ffc53d',
  '#f2b90d',
  '#ffca16',
  '#ffe7b3',
]

const danger: ColorScale = [
  '#191111',
  '#201314',
  '#381316',
  '#4d1519',
  '#5c1a1d',
  '#6e2326',
  '#812b2f',
  '#983337',
  '#e5484d',
  '#dd3e43',
  '#ff9592',
  '#ffd1d9',
]

const info: ColorScale = [
  '#0d1520',
  '#111927',
  '#102a43',
  '#0f3b5c',
  '#114c72',
  '#175d8d',
  '#1d70a5',
  '#2683bd',
  '#0090ff',
  '#0588f0',
  '#70b8ff',
  '#c2e6ff',
]

const colorPart = {
  mode: 'dark',
  intent: {
    neutral,
    accent,
    success,
    warning,
    danger,
    info,
  },
  steps,
  state,
  contrastText,
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
    md: '0 4px 12px rgba(0, 0, 0, 0.5)',
    lg: '0 16px 50px -24px rgba(0, 0, 0, 0.8)',
  },
} as const

export const dark: AppTheme = {
  ...colorPart,
  utils: createThemeUtils(colorPart),
  ...base,
}
