/** Минимум видимых строк редактора кода: пустое поле — 10 пронумерованных строк. */
export const MIN_EDITOR_LINES = 10

/** Срезает концевые пустые строки (сам текст не трогает). */
export function stripTrailingEmpty(value: string): string {
  return value.replace(/(?:\n[ \t]*)+$/, '')
}

/** Доводит документ до минимума строк: срез концевых пустых + паддинг новыми строками. */
export function padToLines(value: string, min = MIN_EDITOR_LINES): string {
  const text = stripTrailingEmpty(value)
  const lines = text.split('\n').length

  return lines >= min ? text : text + '\n'.repeat(min - lines)
}
