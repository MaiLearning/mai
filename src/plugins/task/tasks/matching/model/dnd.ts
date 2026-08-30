/** Идентификаторы и парсинг dnd-целей доски Matching. */

/** id droppable-зоны пула фишек. */
export const POOL_ID = 'pool'

const CHIP_PREFIX = 'chip-'
const SLOT_PREFIX = 'slot-'

/** dnd-id фишки-определения пары. */
export const chipDndId = (pairId: string) => `${CHIP_PREFIX}${pairId}`

/** dnd-id слота термина пары. */
export const slotDndId = (pairId: string) => `${SLOT_PREFIX}${pairId}`

/** pairId из dnd-id фишки. */
export const parseChipPairId = (dndId: string) => dndId.slice(CHIP_PREFIX.length)

/** pairId из dnd-id слота, либо null (цель — не слот). */
export const parseSlotPairId = (dndId: string): string | null =>
  dndId.startsWith(SLOT_PREFIX) ? dndId.slice(SLOT_PREFIX.length) : null
