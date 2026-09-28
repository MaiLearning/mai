import type { AppTheme, ColorScale } from '../../theme'
import { createThemeUtils } from '../../utils'
import { base } from './base'
import { contrastText, lightSteps, state } from './steps'

const neutral: ColorScale = [
  '#fcfcfc',
  '#f9f9f9',
  '#f0f0f0',
  '#e8e8e8',
  '#e0e0e0',
  '#d9d9d9',
  '#cecece',
  '#bbbbbb',
  '#8d8d8d',
  '#838383',
  '#646464',
  '#202020',
]

const accent: ColorScale = [
  '#fdfcfe',
  '#faf8ff',
  '#f4f0fe',
  '#ebe4ff',
  '#e1d9ff',
  '#d4cafe',
  '#c2b5f5',
  '#aa99ec',
  '#6e56cf',
  '#654dc4',
  '#6550b9',
  '#2f265f',
]

const success: ColorScale = [
  '#fbfefc',
  '#f4fbf6',
  '#e6f6eb',
  '#d6f1df',
  '#c4e8d1',
  '#adddc0',
  '#8eceaa',
  '#5bb98b',
  '#30a46c',
  '#2b9a66',
  '#218358',
  '#193b2d',
]

const warning: ColorScale = [
  '#fefdfb',
  '#fefbe9',
  '#fff7c2',
  '#ffee9c',
  '#fbe577',
  '#f3d673',
  '#e9c162',
  '#e2a336',
  '#ffc53d',
  '#ffba18',
  '#ab6400',
  '#4f3422',
]

const danger: ColorScale = [
  '#fffcfc',
  '#fff8f8',
  '#ffebeb',
  '#ffdbdb',
  '#ffcdcd',
  '#fdbebe',
  '#f4a9a9',
  '#eb9091',
  '#e5484d',
  '#dc3e42',
  '#ce2c31',
  '#641723',
]

const info: ColorScale = [
  '#fbfdff',
  '#f4faff',
  '#e6f4fe',
  '#d5efff',
  '#c2e5ff',
  '#acd8fc',
  '#8ec8f6',
  '#5eb1ef',
  '#0090ff',
  '#0588f0',
  '#0d74ce',
  '#113264',
]

const colorPart = {
  mode: 'light',
  intent: {
    neutral,
    accent,
    success,
    warning,
    danger,
    info,
  },
  steps: lightSteps,
  state,
  contrastText,
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
} as const

export const light: AppTheme = {
  ...colorPart,
  utils: createThemeUtils({ ...colorPart, spacing: base.spacing }),
  ...base,
}
