import { beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { sendGatewayCall, sendGatewayManifests } from '../api/call'
import { GatewayCallError } from '../core'
import { callGateway, fetchGatewayManifests } from './call'

vi.mock('../api/call', () => ({
  sendGatewayCall: vi.fn(),
  sendGatewayManifests: vi.fn(),
}))

const sendCallMock = vi.mocked(sendGatewayCall)
const sendManifestsMock = vi.mocked(sendGatewayManifests)

const PayloadSchema = z.object({ resourceId: z.string(), total: z.number() })

describe('gateway call service', () => {
  beforeEach(() => {
    sendCallMock.mockReset()
    sendManifestsMock.mockReset()
  })

  it('валидирует ответ backend схемой и возвращает данные', async () => {
    sendCallMock.mockResolvedValue({ resourceId: 'r1', total: 3 })

    await expect(callGateway(PayloadSchema, 'internal-task', 'snapshot')).resolves.toEqual({
      resourceId: 'r1',
      total: 3,
    })
  })

  it('передаёт запрос в wire-форме с caller по умолчанию', async () => {
    sendCallMock.mockResolvedValue({ resourceId: 'r1', total: 3 })

    await callGateway(
      PayloadSchema,
      'internal-task',
      'snapshot',
      { resourceId: 'r1' },
      'internal-analytics',
    )

    expect(sendCallMock).toHaveBeenCalledWith({
      pluginId: 'internal-task',
      method: 'snapshot',
      args: { resourceId: 'r1' },
      caller: 'internal-analytics',
    })
  })

  it('превращает gateway-rejection в GatewayCallError с кодом', async () => {
    sendCallMock.mockRejectedValue({ code: 'notFound', message: 'Ресурс не найден' })

    const error = await callGateway(PayloadSchema, 'internal-task', 'snapshot').catch(
      (e: unknown) => e,
    )

    expect(error).toBeInstanceOf(GatewayCallError)
    expect((error as GatewayCallError).code).toBe('notFound')
  })

  it('пропускает насквозь не-gateway ошибки', async () => {
    sendCallMock.mockRejectedValue(new Error('invoke failed'))

    await expect(callGateway(PayloadSchema, 'internal-task', 'snapshot')).rejects.toThrow(
      'invoke failed',
    )
  })

  it('отклоняет битый ответ gateway (не проходит схему)', async () => {
    sendCallMock.mockResolvedValue({ resourceId: 42 })

    const error = await callGateway(PayloadSchema, 'internal-task', 'snapshot').catch(
      (e: unknown) => e,
    )

    expect(error).toBeInstanceOf(GatewayCallError)
    expect((error as GatewayCallError).code).toBe('handlerError')
  })
})

describe('gateway manifests service', () => {
  beforeEach(() => sendManifestsMock.mockReset())

  it('валидирует и возвращает манифесты плагинов', async () => {
    sendManifestsMock.mockResolvedValue([
      {
        pluginId: 'internal-task',
        version: '0.1.0',
        methods: [{ name: 'snapshot', description: 'Снапшот контента' }],
      },
    ])

    await expect(fetchGatewayManifests()).resolves.toEqual([
      {
        pluginId: 'internal-task',
        version: '0.1.0',
        methods: [{ name: 'snapshot', description: 'Снапшот контента' }],
      },
    ])
  })

  it('отклоняет битый манифест', async () => {
    sendManifestsMock.mockResolvedValue([{ version: '0.1.0' }])

    await expect(fetchGatewayManifests()).rejects.toThrow()
  })
})
