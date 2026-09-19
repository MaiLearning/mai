import type { z } from 'zod'
import type {
  GatewayCallRequestSchema,
  GatewayErrorCodeSchema,
  GatewayErrorSchema,
  GatewayManifestSchema,
  GatewayMethodInfoSchema,
} from './schema'

export type GatewayErrorCode = z.infer<typeof GatewayErrorCodeSchema>
export type GatewayError = z.infer<typeof GatewayErrorSchema>
export type GatewayMethodInfo = z.infer<typeof GatewayMethodInfoSchema>
export type GatewayManifest = z.infer<typeof GatewayManifestSchema>
export type GatewayCallRequest = z.infer<typeof GatewayCallRequestSchema>
