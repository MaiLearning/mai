/**
 * Публичные экспорты стандартного дизайна.
 *
 * Реестр находится уровнем выше, в `base/registry.ts`; этот файл нужен только
 * для удобного импорта общих токенов и стандартных вариаций.
 */

export type { AppTheme, ColorScale, Palette } from '../theme'
export { base } from './default/base'
export { dark } from './default/dark'
export { light } from './default/light'
