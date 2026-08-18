import { z } from 'zod'
import {
  fetchPluginById as invokeFetchById,
  fetchPluginCode as invokeFetchCode,
  fetchPluginManifest as invokeFetchManifest,
  fetchPlugins as invokeFetchPlugins,
} from '../api/fetch'
import type { Plugin, PluginManifest } from '../core/model'
import { PluginManifestSchema, PluginSchema } from '../core/schema'

export async function fetchPlugins(): Promise<Plugin[]> {
  const data = await invokeFetchPlugins()
  return z.array(PluginSchema).parse(data)
}

export async function fetchPluginById(id: string): Promise<Plugin> {
  const data = await invokeFetchById(id)
  return PluginSchema.parse(data)
}

export async function fetchPluginCode(id: string): Promise<string> {
  return invokeFetchCode(id)
}

export async function fetchPluginManifest(id: string): Promise<PluginManifest> {
  const data = await invokeFetchManifest(id)
  return PluginManifestSchema.parse(data)
}
