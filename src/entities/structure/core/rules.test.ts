import { describe, expect, it } from 'vitest'
import { InvalidPositionError, InvalidStructureNodeIdError } from './exceptions'
import { validateNodeId, validatePosition } from './rules'

describe('structure rules', () => {
  it('normalizes node IDs and accepts zero position', () => {
    expect(validateNodeId(' node-1 ')).toBe('node-1')
    expect(validatePosition(0)).toBe(0)
  })

  it('rejects empty IDs and negative positions', () => {
    expect(() => validateNodeId(' ')).toThrow(InvalidStructureNodeIdError)
    expect(() => validatePosition(-1)).toThrow(InvalidPositionError)
  })
})
