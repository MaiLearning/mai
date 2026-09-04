import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeState } from '@/utils/fake-entities-storage/state'
import type { Link, LinkSourceType, LinkTarget } from '../core/model'

function copyLink(link: Link): Link {
  return { ...link, target: { ...link.target } }
}

function sameTarget(a: LinkTarget, b: LinkTarget): boolean {
  if (a.kind !== b.kind) return false
  if (a.kind === 'uri' && b.kind === 'uri') return a.uri === b.uri
  if (a.kind === 'course' && b.kind === 'course') return a.courseId === b.courseId
  if (a.kind === 'resource' && b.kind === 'resource')
    return a.courseId === b.courseId && a.resourceId === b.resourceId

  return false
}

export function listLinks(sourceType: LinkSourceType, sourceId: string): Promise<Link[]> {
  if (!isFakeDataEnabled) return invoke<Link[]>('list_links', { sourceType, sourceId })

  return Promise.resolve(
    fakeState.links
      .filter((link) => link.sourceType === sourceType && link.sourceId === sourceId)
      .map(copyLink),
  )
}

export function listBacklinks(target: LinkTarget): Promise<Link[]> {
  if (!isFakeDataEnabled) return invoke<Link[]>('list_backlinks', { target })

  return Promise.resolve(
    fakeState.links.filter((link) => sameTarget(link.target, target)).map(copyLink),
  )
}

export function listCourseLinks(courseId: string): Promise<Link[]> {
  if (!isFakeDataEnabled) return invoke<Link[]>('list_course_links', { courseId })

  return Promise.resolve(
    fakeState.links
      .filter((link) => link.target.kind !== 'uri' && link.target.courseId === courseId)
      .map(copyLink),
  )
}
