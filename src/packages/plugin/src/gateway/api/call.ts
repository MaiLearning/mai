import { invoke } from '@mai/tauri/ipc'
import type { GatewayCallRequest } from '../core'

export function sendGatewayCall(request: GatewayCallRequest): Promise<unknown> {
  return invoke<unknown>('plugin_gateway_call', { request })
}

export function sendGatewayManifests(): Promise<unknown> {
  return invoke<unknown>('plugin_gateway_manifests')
}
