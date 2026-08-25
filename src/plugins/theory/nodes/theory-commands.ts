import type { CalloutTone } from './CalloutNode'

/**
 * Единая декларация команд плагина theory.
 *
 * Все кастомные команды собираются под одним ключом `theory`
 * (разделение по разным файлам вызывает конфликт деклараций интерфейса).
 */
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    theory: {
      /** Вставляет выноску с указанным тоном (по умолчанию info). */
      insertCallout: (attrs?: { tone?: CalloutTone }) => ReturnType
      /** Вставляет пустой блок формулы в позицию курсора. */
      insertFormula: () => ReturnType
      /** Вставляет блок видео; при передаче url — сразу заполненный. */
      insertEmbed: (attrs?: { url?: string; caption?: string }) => ReturnType
    }
  }
}

export {}
