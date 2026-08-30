/**
 * Тонкий слой DOM → модель. Не тестируется в Vitest: environment 'node',
 * document недоступен; вся содержательная логика — в model/blanks.ts.
 */

/** Кусок параграфа, разобранный из DOM: текст и, возможно, пропуск. */
export interface ParsedSegment {
  text: string
  blank: string | null
}

/** Границы выделения внутри одного текстового узла параграфа. */
export interface SelectionTarget {
  segIndex: number
  start: number
  end: number
}

/**
 * Разбор childNodes параграфа в сегменты: текстовый узел — кусок текста;
 * элемент с data-blank — пропуск (ответ берётся из data-answer) и относится
 * к предыдущему текстовому куску, а если его нет — начинает кусок с пустым
 * текстом. Прочие элементы сплющиваются в текст. id не заполняются — их
 * расставляет reIdByPosition по позициям.
 */
export function segmentsFromDom(root: HTMLElement): ParsedSegment[] {
  const segments: ParsedSegment[] = []
  for (const node of Array.from(root.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? ''
      if (text) segments.push({ text, blank: null })
    } else if (node instanceof HTMLElement) {
      if (node.hasAttribute('data-blank')) {
        const blank = node.getAttribute('data-answer') ?? ''
        const prev = segments[segments.length - 1]
        if (prev && prev.blank === null) prev.blank = blank
        else segments.push({ text: '', blank })
      } else {
        const text = node.textContent ?? ''
        if (text) segments.push({ text, blank: null })
      }
    }
  }

  return segments
}

/**
 * Цель для «Сделать пропуском»: одиночное невырожденное выделение внутри
 * одного текстового узла, являющегося прямым ребёнком параграфа (это
 * исключает выделения внутри чипов). Индексы — по символам текста сегмента.
 * Иначе null.
 */
export function selectionTarget(
  root: HTMLElement | null,
  selection: Selection | null,
): SelectionTarget | null {
  if (!root || !selection || selection.rangeCount === 0) return null
  const range = selection.getRangeAt(0)
  if (range.collapsed) return null
  const node = range.startContainer
  if (node !== range.endContainer) return null
  if (node.nodeType !== Node.TEXT_NODE) return null
  if (node.parentElement !== root) return null

  return { segIndex: segmentIndexAt(root, node), start: range.startOffset, end: range.endOffset }
}

/**
 * Индекс сегмента, владеющего текстовым узлом: текстовый узел начинает свой
 * сегмент; чип увеличивает счётчик, только если «прилипнуть» ему не к кому —
 * предыдущий сосед не текст (владение совпадает с правилом segmentsFromDom).
 */
function segmentIndexAt(root: HTMLElement, textNode: Node): number {
  let index = 0
  let prev: Node | null = null
  for (const child of Array.from(root.childNodes)) {
    if (child === textNode) return index
    if (child.nodeType === Node.TEXT_NODE) {
      index += 1
    } else if (
      child instanceof HTMLElement &&
      child.hasAttribute('data-blank') &&
      !(prev && prev.nodeType === Node.TEXT_NODE)
    ) {
      index += 1
    }
    prev = child
  }

  return -1
}
