import type { BlankSegment } from '../../../core/types'

/** Фабрика новых id (uuid приходит снаружи — модель остаётся чистой). */
export type NewId = () => string

/** Сегмент без гарантированного id (например, разобранный из DOM). */
export type SegmentInput = Omit<BlankSegment, 'id'> & { id?: string }

/**
 * Режет сегмент segIndex на [текст до, пропуск, текст после] по границам
 * символов выделения. Куски «до»/«после» наследуют id сегмента и создаются
 * только если непусты; пропуск получает newId и пустой текст. Пустое
 * выделение, сегмент с пропуском или несуществующий индекс — no-op.
 */
export function makeBlank(
  segments: BlankSegment[],
  segIndex: number,
  start: number,
  end: number,
  newId: string,
): BlankSegment[] {
  const seg = segments[segIndex]
  const selected = seg ? seg.text.slice(start, end) : ''
  if (!seg || seg.blank !== null || !selected) return segments

  const before = seg.text.slice(0, start)
  const after = seg.text.slice(end)
  const produced: BlankSegment[] = []
  if (before) produced.push({ ...seg, text: before, blank: null })
  produced.push({ id: newId, text: '', blank: selected })
  if (after) produced.push({ ...seg, text: after, blank: null })

  return [...segments.slice(0, segIndex), ...produced, ...segments.slice(segIndex + 1)]
}

/** Гасит пропуск сегмента segIndex; сам сегмент и его текст сохраняются. */
export function removeBlank(segments: BlankSegment[], segIndex: number): BlankSegment[] {
  return segments.map((s, i) => (i === segIndex ? { ...s, blank: null } : s))
}

/**
 * Стабильность id по позиции: сегмент i наследует id prev[i] (если такой
 * был), иначе получает свежий из newId. Благодаря этому ответы (values
 * по id сегмента) переживают текстовые правки и перестройки структуры.
 */
export function reIdByPosition(
  next: SegmentInput[],
  prev: BlankSegment[],
  newId: NewId,
): BlankSegment[] {
  return next.map((seg, i) => {
    const stable = prev[i]

    return { ...seg, id: stable ? stable.id : newId() }
  })
}

/** Выбрасывает сегменты без текста и без пропуска — невидимые остатки removeBlank. */
export function dropEmpty(segments: BlankSegment[]): BlankSegment[] {
  return segments.filter((s) => s.text !== '' || s.blank !== null)
}
