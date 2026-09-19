/**
 * Детерминированное перемешивание: одинаковый seed даёт одинаковый порядок.
 * Используется для стабильного между сессиями порядка фишек (Matching)
 * и элементов (Ordering) в режиме прохождения.
 */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  const rand = mulberry32(hashSeed(seed))
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

/** FNV-подобное перемешивание бит строки в 32-битное зерно. */
const hashSeed = (seed: string) => {
  let h = 1779033703
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }

  return h >>> 0
}

/** mulberry32 — компактный детерминированный ГПСЧ. */
const mulberry32 = (a: number) => () => {
  a |= 0
  a = (a + 0x6d2b79f5) | 0
  let t = Math.imul(a ^ (a >>> 15), 1 | a)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t

  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
