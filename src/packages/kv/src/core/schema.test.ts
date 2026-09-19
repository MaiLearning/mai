import { describe, expect, it } from 'vitest'
import { KvEntrySchema, KvKeySchema } from './schema'

describe('KvKeySchema', () => {
  it('accepts valid keys', () => {
    expect(KvKeySchema.parse('course.last_opened_id')).toBe('course.last_opened_id')
    expect(KvKeySchema.parse('code-plugin/runtimes')).toBe('code-plugin/runtimes')
    expect(KvKeySchema.parse('aZ09._:/-')).toBe('aZ09._:/-')
  })

  it('rejects empty key', () => {
    expect(() => KvKeySchema.parse('')).toThrow()
  })

  it('rejects key longer than 256 chars', () => {
    expect(() => KvKeySchema.parse('a'.repeat(257))).toThrow()
    expect(KvKeySchema.parse('a'.repeat(256))).toBe('a'.repeat(256))
  })

  it('rejects forbidden symbols', () => {
    for (const key of ['с ключом', 'key with space', 'key!', 'key@x', 'key#', 'ключ']) {
      expect(() => KvKeySchema.parse(key)).toThrow()
    }
  })
})

describe('KvEntrySchema', () => {
  it('accepts valid entry with any value', () => {
    const entry = { key: 'k', value: { nested: [1] }, createdAt: 1, updatedAt: 2 }
    expect(KvEntrySchema.parse(entry)).toEqual(entry)
  })

  it('rejects entry without timestamps', () => {
    expect(() => KvEntrySchema.parse({ key: 'k', value: null })).toThrow()
  })
})
