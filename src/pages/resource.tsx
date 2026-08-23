import { useParams } from 'react-router-dom'
import { Viewer } from '@/features/viewer'

/**
 * ResourcePage — страница просмотра ресурса курса.
 * Роут: /course/:courseId/resource/:resourceId
 */
export function ResourcePage() {
  const { courseId, resourceId } = useParams<{ courseId: string; resourceId: string }>()

  if (!courseId || !resourceId) {
    return null
  }

  return <Viewer resourceId={resourceId} courseId={courseId} />
}
