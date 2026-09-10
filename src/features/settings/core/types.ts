import type { LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'

/** Метаданные одного поля настройки — декларация для поисковика:
 * матч по label/keywords, переход открывает секцию и подсвечивает поле. */
export interface SettingsFieldMeta {
  /** Идентификатор поля внутри секции (якорь подсветки). */
  id: string
  /** Название настройки (готовый текст, для секций плагинов). */
  label?: string
  /** i18n-ключ названия (для встроенных секций, реактивен к языку). */
  labelKey?: string
  /** Дополнительные слова для поиска. */
  keywords?: string[]
  /** Подраздел внутри страницы секции (для структуры результатов). */
  group?: string
}

/**
 * Секция настроек — пункт сайдбара и страница в main-области.
 * Плагины объявляют секции в корневом файле settings.tsx (internal)
 * или через External Plugin API (external, в планах).
 */
export interface SettingsSection {
  /** Уникальный идентификатор; по умолчанию URL — /settings/<id>. */
  id: string
  icon: LucideIcon
  /** Готовый текст названия (для секций плагинов). */
  label?: string
  /** i18n-ключ названия (для встроенных секций, реактивен к языку). */
  labelKey?: string
  /**
   * Явный путь перехода; по умолчанию /settings/<id>.
   * Нужен параметрическим секциям (например, настройки курса).
   */
  path?: string
  /** Декларация полей для поиска. */
  fields?: SettingsFieldMeta[]
  /** Содержимое main-области. */
  component?: ComponentType
}

/** Группа секций сайдбара; заголовок опционален («Встроенные плагины»). */
export interface SettingsGroup {
  /** Уникальный идентификатор группы. */
  id: string
  /** Готовый текст заголовка группы. */
  header?: string
  /** i18n-ключ заголовка группы (реактивен к языку). */
  headerKey?: string
  sections: SettingsSection[]
}
