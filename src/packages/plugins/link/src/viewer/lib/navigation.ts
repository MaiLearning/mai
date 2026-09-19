import { notifyError } from '@mai/notifications'
import { error as logError } from '@mai/tauri/logs'
import { openUrl } from '@mai/tauri/opener'
import type { NavigateFunction } from 'react-router-dom'
import type { LinkTarget } from '../../entity'

/**
 * Переход по цели ребра: внутренняя сущность — роутером, URI — системным
 * обработчиком через tauri-plugin-opener.
 */
export async function openLinkTarget(
  target: LinkTarget,
  navigate: NavigateFunction,
  openFailedMessage: string,
): Promise<void> {
  if (target.kind === 'resource') {
    navigate(`/course/${target.courseId}/resource/${target.resourceId}`)

    return
  }
  if (target.kind === 'course') {
    navigate(`/course/${target.courseId}`)

    return
  }
  try {
    await openUrl(target.uri)
  } catch (e) {
    logError(`Не удалось открыть URI ${target.uri}: ${e instanceof Error ? e.message : String(e)}`)
    notifyError(openFailedMessage, target.uri)
  }
}
