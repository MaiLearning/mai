import { useParams } from 'react-router-dom'
import { Bounded, Viewer } from '@/features/viewer'

/**
 * ResourcePage — страница просмотра ресурса курса.
 * Роут: /course/:courseId/resource/:resourceId
 *
 * Bounded ограничивает высоту экраном: viewer скроллит внутренние области,
 * а не страницу целиком (панели остаются закреплёнными).
 */
export function ResourcePage() {
  const { courseId, resourceId } = useParams<{ courseId: string; resourceId: string }>()

  if (!courseId || !resourceId) {
    return null
  }

  return (
    <Bounded>
      <Viewer resourceId={resourceId} courseId={courseId} />
    </Bounded>
  )
}
