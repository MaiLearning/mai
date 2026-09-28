import { describe, expect, it } from 'vitest'
import type { SpacingKey } from '../theme'
import { dark } from '../themes/default/dark'
import { light } from '../themes/default/light'
import { resolveSpace } from './space'

const catalog: SpacingKey[] = ['xs', 'sm', 'md', 'lg', 'xl']

describe('resolveSpace', () => {
  it('takes catalog keys from the scale as is', () => {
    expect(resolveSpace(light, 'xs')).toBe('0.25rem')
    expect(resolveSpace(light, 'md')).toBe('1rem')
    expect(resolveSpace(light, 'xl')).toBe('2rem')
  })

  it('multiplies a number by the base step, not by pixels', () => {
    expect(resolveSpace(light, 8)).toBe('1rem')
    expect(resolveSpace(light, 6)).toBe('0.75rem')
    expect(resolveSpace(light, 24)).toBe('3rem')
    expect(resolveSpace(light, 0)).toBe('0rem')
  })
})

describe('spacing scale integrity', () => {
  it('keeps every catalog value an integer multiple of the base step', () => {
    const { value: step, unit } = light.spacing.step
    for (const key of catalog) {
      const raw = light.spacing[key]
      const value = Number.parseFloat(raw)
      expect(raw.endsWith(unit), `${key}: ${raw} должен быть в ${unit}`).toBe(true)
      expect(Number.isInteger(value / step), `${key}: ${raw} не кратен ${step}`).toBe(true)
    }
  })

  it('resolves the same steps in both variations: the step is not chromatic', () => {
    expect(light.spacing.step).toEqual(dark.spacing.step)
    expect(light.utils.space(8)).toBe('1rem')
    expect(dark.utils.space(8)).toBe('1rem')
  })

  it('guards the step descriptor against a mismatched value and unit', () => {
    // Страховка от тихой поломки: пара `value`/`unit` задаётся вручную,
    // и 0.125px вместо 0.125rem сдвинул бы всю систему незаметно.
    expect(light.utils.space(8)).toBe('1rem')
    expect(light.utils.space('md')).toBe(light.utils.space(8))
  })
})
