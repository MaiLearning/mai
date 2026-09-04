import { z } from 'zod'

export const GatewayErrorCodeSchema = z.enum([
  'pluginNotFound',
  'methodNotFound',
  'badArgs',
  'notFound',
  'handlerError',
])

export const GatewayErrorSchema = z.object({
  code: GatewayErrorCodeSchema,
  message: z.string(),
})

export const GatewayMethodInfoSchema = z.object({
  name: z.string(),
  description: z.string(),
})

export const GatewayManifestSchema = z.object({
  pluginId: z.string(),
  version: z.string(),
  methods: z.array(GatewayMethodInfoSchema),
})

export const GatewayCallRequestSchema = z.object({
  pluginId: z.string(),
  method: z.string(),
  args: z.unknown().optional(),
  caller: z.string().optional(),
})
