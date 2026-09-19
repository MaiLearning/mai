import { sendCreateLink as invokeCreate } from '../api/create'
import type { CreateLinkInput, Link } from '../core/model'
import {
  validateLinkDescription,
  validateLinkOwnerPluginId,
  validateLinkSourceId,
  validateLinkTarget,
  validateLinkTitle,
} from '../core/rules'
import { CreateLinkInputSchema, LinkSchema } from '../core/schema'

/**
 * createLink — создание ссылки.
 *
 * Порядок: клиентская валидация (rules, зеркально backend) →
 * CreateLinkInputSchema.parse → api → LinkSchema.parse ответа.
 */
export async function createLink(input: CreateLinkInput): Promise<Link> {
  const request = CreateLinkInputSchema.parse({
    sourceType: input.sourceType,
    sourceId: validateLinkSourceId(input.sourceId),
    target: validateLinkTarget(input.target),
    ownerPluginId: validateLinkOwnerPluginId(input.ownerPluginId),
    title: validateLinkTitle(input.title ?? null),
    description: validateLinkDescription(input.description ?? null),
  })
  const data = await invokeCreate(request)

  return LinkSchema.parse(data)
}
