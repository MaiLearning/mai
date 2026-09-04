import type { GatewayErrorCode } from './types'

/** Ошибка gateway-вызова: структурированный код от backend + сообщение. */
export class GatewayCallError extends Error {
  readonly code: GatewayErrorCode

  constructor(code: GatewayErrorCode, message: string) {
    super(message)
    this.name = 'GatewayCallError'
    this.code = code
  }
}
