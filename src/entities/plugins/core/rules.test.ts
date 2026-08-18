import { describe, expect, it } from 'vitest'
import { InvalidManifestError, InvalidPluginVersionError } from './exceptions'
import { validateManifest, validatePluginVersion } from './rules'

describe('plugin rules', () => {
  it('normalizes versions and accepts valid manifest', () => {
    expect(validatePluginVersion('  1.0.0  ')).toBe('1.0.0')
    expect(() =>
      validateManifest({
        id: 'plugin',
        name: 'Plugin',
        version: '1.0.0',
        main: 'index.js',
        description: null,
        author: null,
        resources: null,
      }),
    ).not.toThrow()
  })

  it('rejects invalid versions and empty manifest entrypoint', () => {
    expect(() => validatePluginVersion('')).toThrow(InvalidPluginVersionError)
    expect(() =>
      validateManifest({
        id: 'plugin',
        name: 'Plugin',
        version: '1.0.0',
        main: '  ',
        description: null,
        author: null,
        resources: null,
      }),
    ).toThrow(InvalidManifestError)
  })
})
