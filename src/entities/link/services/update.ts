import { sendUpdateLink as invokeUpdate } from '../api/update'
import type { Link, UpdateLinkInput } from '../core/model'
import {
  validateLinkDescription,
  validateLinkId,
  validateLinkOwnerPluginId,
  validateLinkTarget,
  validateLinkTitle,
} from '../core/rules'
import { LinkSchema, UpdateLinkInputSchema } from '../core/schema'

/**
 * updateLink — изменение ссылки плагином-владельцем.
 *
 * Незаданные поля остаются undefined (не затираются на backend);
 * явный null трактуется как сброс значения.
 */
export async function updateLink(input: UpdateLinkInput): Promise<Link> {
  const request = UpdateLinkInputSchema.parse({
    id: validateLinkId(input.id),
    ownerPluginId: validateLinkOwnerPluginId(input.ownerPluginId),
    title: input.title === undefined ? undefined : validateLinkTitle(input.title),
    description:
      input.description === undefined ? undefined : validateLinkDescription(input.description),
    target: input.target === undefined ? undefined : validateLinkTarget(input.target),
  })
  const data = await invokeUpdate(request)

  return LinkSchema.parse(data)
}
