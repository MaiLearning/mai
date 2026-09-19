import { invoke } from '@mai/tauri/ipc'
import type { Link, LinkSourceType, LinkTarget } from '../core/model'

export function listLinks(sourceType: LinkSourceType, sourceId: string): Promise<Link[]> {
  return invoke<Link[]>('list_links', { sourceType, sourceId })
}

export function listBacklinks(target: LinkTarget): Promise<Link[]> {
  return invoke<Link[]>('list_backlinks', { target })
}

export function listCourseLinks(courseId: string): Promise<Link[]> {
  return invoke<Link[]>('list_course_links', { courseId })
}
