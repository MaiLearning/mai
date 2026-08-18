import { theme } from './theme'

/**
 * Media query helper: up("md") → "@media (min-width: 768px)"
 * Используется в styled-components для responsive дизайна.
 */
export const up = (key: keyof typeof theme.breakpoints) =>
  `@media (min-width: ${theme.breakpoints[key]})`
