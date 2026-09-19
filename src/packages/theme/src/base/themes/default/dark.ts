import type { AppTheme, ColorScale, Palette } from '../../theme'
import { base } from './base'

const _gray: ColorScale = [
  '#17181a',
  '#1b1b1f',
  '#222326',
  '#292a2e',
  '#303136',
  '#393a40',
  '#46474f',
  '#5a5b66',
  '#6c6e79',
  '#797b86',
  '#b2b3bd',
  '#eeeef0',
]

const _accent: ColorScale = [
  '#1c151e',
  '#231526',
  '#36193e',
  '#461951',
  '#52205e',
  '#5f2c6c',
  '#753c84',
  '#954da8',
  '#c253de',
  '#b545d0',
  '#eb8eff',
  '#f4d3fd',
]

const _success: ColorScale = [
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

const _warning: ColorScale = [
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

const _danger: ColorScale = [
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

const _info: ColorScale = [
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

const palette: Palette = {
  gray: _gray,
  accent: _accent,
  background: '#0f172a',
  success: _success,
  warning: _warning,
  danger: _danger,
  info: _info,
}
const { gray, accent, background, success, warning, danger, info } = palette

export const dark = {
  ...base,
  text: {
    primary: gray[11],
    muted: gray[10],
    onPrimary: accent[11],
    accent: accent[11],
  },
  background: {
    body: background,
    surface: gray[1],
    elevated: gray[2],
    accent: accent[9],
    accentHover: accent[10],
    accentSubtle: accent[2],
    hover: gray[2],
    active: gray[3],
    selected: accent[3],
    disabled: gray[1],
  },
  border: {
    default: gray[6],
    strong: gray[8],
    accent: accent[9],
  },
  status: {
    success: { foreground: success[10], background: success[2] },
    warning: { foreground: warning[10], background: warning[2] },
    danger: { foreground: danger[10], background: danger[2] },
    info: { foreground: info[10], background: info[2] },
  },
  focus: {
    ring: accent[9],
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
    md: '0 4px 12px rgba(0, 0, 0, 0.5)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.6)',
  },
} satisfies AppTheme
