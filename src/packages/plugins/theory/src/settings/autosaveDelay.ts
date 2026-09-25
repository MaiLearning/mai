export type TheoryAutosaveDelay = 500 | 1000 | 2000

export const DEFAULT_THEORY_AUTOSAVE_DELAY: TheoryAutosaveDelay = 500

export function parseTheoryAutosaveDelay(value: unknown): TheoryAutosaveDelay {
  if (value === '1000') return 1000
  if (value === '2000') return 2000

  return DEFAULT_THEORY_AUTOSAVE_DELAY
}
