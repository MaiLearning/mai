import {
  InvalidManifestError,
  InvalidPluginIdError,
  InvalidPluginNameError,
  InvalidPluginVersionError,
  InvalidSdkVersionError,
} from './exceptions'
import type { PluginManifest } from './model'

type EntityError = new (message: string) => Error

const bounded = (value: string, min: number, max: number, error: EntityError, label: string) => {
  const v = value.trim()
  if (v.length < min || v.length > max)
    throw new error(`${label}: допустимо от ${min} до ${max} символов`)

  return v
}
export const validatePluginId = (v: string) =>
  bounded(v, 1, 64, InvalidPluginIdError, 'Идентификатор плагина')
export const validatePluginName = (v: string) =>
  bounded(v, 2, 120, InvalidPluginNameError, 'Название плагина')
export const validatePluginVersion = (v: string) =>
  bounded(v, 1, 32, InvalidPluginVersionError, 'Версия плагина')
export const validateSdkVersion = (v: string) =>
  bounded(v, 1, 32, InvalidSdkVersionError, 'Версия SDK')
export function validateManifest(manifest: PluginManifest): void {
  if (!manifest.main.trim())
    throw new InvalidManifestError('Поле main manifest не может быть пустым')
}
