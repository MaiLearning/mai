import { describe, expect, it } from 'vitest'
import { dark } from '../themes/default/dark'
import { light } from '../themes/default/light'
import { getColor } from './getColor'

describe('getColor foreground steps', () => {
  it('keeps neutral dark primary text on step 12', () => {
    expect(getColor(dark, 'neutral', 'foreground', 'primary')).toBe('#eeeef0')
  })

  it('uses step 11 for chromatic dark primary text', () => {
    expect(getColor(dark, 'danger', 'foreground', 'primary')).toBe('#ff9592')
    expect(getColor(dark, 'warning', 'foreground', 'primary')).toBe('#ffca16')
  })

  it('preserves light primary text colors', () => {
    expect(getColor(light, 'danger', 'foreground', 'primary')).toBe('#641723')
  })
})
