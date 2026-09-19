import type { z } from 'zod'
import { sendGatewayCall, sendGatewayManifests } from '../api/call'
import type { GatewayManifest } from '../core'
import { GatewayCallError, GatewayErrorSchema, GatewayManifestSchema } from '../core'

const DEFAULT_CALLER = 'app'

/**
 * Вызов gateway-метода плагина.
 *
 * Ответ валидируется схемой потребителя (например, TaskSnapshotDataSchema
 * из `@/entities/task-plugin` — источник истины для wire-контракта).
 * Ошибка backend превращается в GatewayCallError; прочие ошибки проходят
 * насквозь.
 */
export async function callGateway<T>(
  schema: z.ZodType<T>,
  pluginId: string,
  method: string,
  args?: unknown,
  caller: string = DEFAULT_CALLER,
): Promise<T> {
  let data: unknown
  try {
    data = await sendGatewayCall({ pluginId, method, args: args ?? {}, caller })
  } catch (e) {
    throw parseGatewayRejection(e) ?? e
  }

  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    throw new GatewayCallError(
      'handlerError',
      `Некорректный ответ gateway от ${pluginId}::${method}: ${parsed.error.message}`,
    )
  }

  return parsed.data
}

/** Манифесты gateway всех плагинов (дискавери: кто какие методы открыл). */
export async function fetchGatewayManifests(): Promise<GatewayManifest[]> {
  const data = await sendGatewayManifests()

  return GatewayManifestSchema.array().parse(data)
}

/** Разбор rejection от invoke в GatewayCallError; не-gateway ошибки → null. */
export function parseGatewayRejection(e: unknown): GatewayCallError | null {
  const parsed = GatewayErrorSchema.safeParse(e)

  return parsed.success ? new GatewayCallError(parsed.data.code, parsed.data.message) : null
}
