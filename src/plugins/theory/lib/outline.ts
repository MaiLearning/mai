import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

/** Запись структуры документа: заголовок с позицией в документе. */
export interface OutlineEntry {
  /** Позиция узла заголовка в документе ProseMirror. */
  pos: number
  /** Уровень заголовка (1–3). */
  level: number
  /** Текст заголовка. */
  text: string
}

/**
 * Извлекает заголовки документа для боковой панели «Структура».
 * Обход выполняется сверху вниз, поэтому порядок записей соответствует порядку в документе
 * (и порядку соответствующих DOM-элементов).
 */
export function extractOutline(doc: ProseMirrorNode): OutlineEntry[] {
  const entries: OutlineEntry[] = []

  doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      entries.push({
        pos,
        level: typeof node.attrs.level === 'number' ? node.attrs.level : 2,
        text: node.textContent,
      })
    }
  })

  return entries
}

/** Порог от верха контейнера, выше которого заголовок считается активным. */
const SPY_THRESHOLD_PX = 120

/**
 * Определяет индекс активного раздела по позиции прокрутки контейнера.
 * Активным считается последний заголовок, верх которого выше порога от верха контейнера.
 */
export function resolveActiveOutlineIndex(container: HTMLElement): number {
  const headings = container.querySelectorAll<HTMLElement>(
    '.ProseMirror h1, .ProseMirror h2, .ProseMirror h3',
  )
  if (headings.length === 0) return -1

  let active = -1

  for (let i = 0; i < headings.length; i += 1) {
    if (headings[i].offsetTop - container.scrollTop <= SPY_THRESHOLD_PX) active = i
  }

  return active
}

/**
 * Прокручивает контейнер к заголовку по его индексу в документе.
 * Порядок DOM-заголовков совпадает с порядком записей extractOutline.
 *
 * @param container прокручиваемый контейнер (Canvas)
 * @param index индекс записи в структуре
 */
export function scrollToOutlineIndex(container: HTMLElement, index: number): void {
  const headings = container.querySelectorAll<HTMLElement>(
    '.ProseMirror h1, .ProseMirror h2, .ProseMirror h3',
  )
  const target = headings[index]
  if (!target) return

  container.scrollTo({ top: Math.max(target.offsetTop - 90, 0), behavior: 'smooth' })
}
