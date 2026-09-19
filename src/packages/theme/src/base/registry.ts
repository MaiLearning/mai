import type { AppTheme } from './theme'
import { dark, light } from './themes/default'
import type { ThemeMode, ThemeName, ThemeRegistry } from './types'

/**
 * Центральный реестр дизайнов темы.
 *
 * Для регистрации нового дизайна нужно:
 * 1. создать каталог `base/themes/<name>/`;
 * 2. определить в нём `light.ts` и `dark.ts`, каждый из которых экспортирует
 *    полный объект `AppTheme`;
 * 3. добавить имя в `ThemeName` и пару вариаций в этот объект.
 *
 * Провайдер обращается к темам только через `getTheme`, поэтому добавление
 * дизайна не требует изменений в механизме переключения.
 *
 * Мысль (TODO?): в будущем можно переделать таким образом, чтобы загружать
 * тему из внешних источников, вроде json, тем самым организуя потенциальный
 * маркетплейс для тем.
 */
export const themes: ThemeRegistry = {
  default: { light, dark },
}

/**
 * Возвращает токены указанного дизайна в выбранной цветовой вариации.
 *
 * @param name идентификатор зарегистрированного дизайна
 * @param mode светлая или тёмная вариация дизайна
 */
export function getTheme(name: ThemeName, mode: ThemeMode): AppTheme {
  return themes[name][mode]
}
