import type { MatchingAnswer } from '../../../core/types'

/** Мэппинг ответа: id пары (термин) → id пары, чьё определение приставлено. */
type Mapping = MatchingAnswer['mapping']

/**
 * Приставить фишку chipId к термину leftId. Прежнее значение термина
 * заменяется, фишка убирается у любого другого владельца (фишка не может
 * висеть в двух слотах). Иммутабельно; без изменений возвращает тот же референс.
 */
export function assign(mapping: Mapping, leftId: string, chipId: string): Mapping {
  if (mapping[leftId] === chipId) return mapping
  const next: Mapping = {}
  for (const [holder, value] of Object.entries(mapping)) {
    if (value !== chipId) next[holder] = value
  }
  next[leftId] = chipId

  return next
}

/** Снять фишку с термина leftId. Иммутабельно; без ключа — тот же референс. */
export function unassign(mapping: Mapping, leftId: string): Mapping {
  if (!(leftId in mapping)) return mapping
  const next = { ...mapping }
  delete next[leftId]

  return next
}

/** Какой термин (leftId) держит фишку chipId; null — фишка в пуле. */
export function chipOwner(mapping: Mapping, chipId: string): string | null {
  for (const [holder, value] of Object.entries(mapping)) {
    if (value === chipId) return holder
  }

  return null
}
