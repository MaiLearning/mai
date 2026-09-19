import type { NavigateFunction } from 'react-router-dom'
import { getWikiCourse } from './course-resources'

let navigateFn: NavigateFunction | null = null

/**
 * Регистрирует роутер-навигацию для wiki-ссылок. Модульный контекст:
 * node-вью TipTap монтируются в портале — Router-контекст туда не доходит.
 */
export function setWikiNavigator(navigate: NavigateFunction): void {
  navigateFn = navigate
}

/** Переход к ресурсу курса по клику на wiki-ссылку. */
export function navigateWikiResource(resourceId: string): void {
  const courseId = getWikiCourse()
  if (!navigateFn || !courseId) return

  navigateFn(`/course/${courseId}/resource/${resourceId}`)
}
