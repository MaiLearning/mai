/** Проверяет, что строка — корректный http(s)-URL. */
export function isValidHttpUrl(value: string): boolean {
  if (value.trim().length === 0) return false
  try {
    const parsed = new URL(value)

    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}
