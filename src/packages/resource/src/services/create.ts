import { sendCreateResourceType as invokeCreate } from '../api/create'
import type { CreateResourceTypeInput, ResourceType } from '../core/model'
import {
  validateResourceTypeDescription,
  validateResourceTypeExtensions,
  validateResourceTypeKey,
  validateResourceTypeName,
} from '../core/rules'
import { CreateResourceTypeInputSchema, ResourceTypeSchema } from '../core/schema'

export async function createResourceType(input: CreateResourceTypeInput): Promise<ResourceType> {
  const key = validateResourceTypeKey(input.key)
  const name = validateResourceTypeName(input.name)
  const description = input.description ? validateResourceTypeDescription(input.description) : null
  const supportedExtensions = validateResourceTypeExtensions(input.supportedExtensions)
  const request = CreateResourceTypeInputSchema.parse({
    key,
    name,
    description,
    pluginId: input.pluginId ?? null,
    supportedExtensions,
  })
  const data = await invokeCreate(request)

  return ResourceTypeSchema.parse(data)
}
