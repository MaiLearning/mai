import { useAtomValue, useSetAtom } from 'jotai'
import { PanelLeftOpen, Settings } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Button, Spinner, Text } from '@/app/theme/components'
import { LAST_OPENED_COURSE_KEY } from '@/entities/course'
import { loadCourseByIdAtom, selectCourseAtom } from '@/entities/course/store'
import { setKvValue } from '@/entities/kv/services'
import { CourseSidebarRoot } from '@/features/sidebar'
import {
  FullPage,
  LoadState,
  Main,
  Overlay,
  Rail,
  RailButton,
  Shell,
  SidebarSlot,
} from './course-page.styles'

/**
 * CoursePage — шелл страницы курса.
 *
 * Владеет sidebar-ом структуры курса (features/sidebar, данные из
 * entities/structure + entities/directory) и <Outlet /> для дочерних
 * роутов: обзор курса (index) и просмотр ресурса (Viewer).
 * Sidebar живёт здесь, чтобы не пропадать при переходах между
 * вложенными роутами.
 *
 * Данные курса читаются из store сущности course (coursesByIdAtom);
 * courseId берётся из URL, загрузка триггерится через loadCourseByIdAtom.
 */
export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null)
  const loadCourse = useSetAtom(loadCourseByIdAtom)
  const selectCourse = useMemo(() => selectCourseAtom(courseId ?? ''), [courseId])
  const course = useAtomValue(selectCourse)
  const load = useCallback(() => {
    if (!courseId || course) return
    setLoading(true)
    setError(null)
    loadCourse(courseId)
      .then(() => setLoading(false))
      .catch((e) => {
        setError(e instanceof Error ? e.message : String(e))
        setLoading(false)
      })
  }, [courseId, course, loadCourse])

  useEffect(() => {
    load()
  }, [load])

  // Фиксируем последний открытый курс (fire-and-forget, ошибка не критична)
  useEffect(() => {
    if (!courseId) return
    setKvValue(LAST_OPENED_COURSE_KEY, courseId).catch((e) => {
      console.warn('[course-page] failed to save last opened course:', e)
    })
  }, [courseId])

  // Свайп вправо от левого края открывает содержание (тач-экраны).
  // Закрытие — тапом по затемнению или выбором ресурса.
  useEffect(() => {
    if (menuOpen) return
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      swipeStartRef.current = touch.clientX <= 24 ? { x: touch.clientX, y: touch.clientY } : null
    }
    const onTouchEnd = (event: TouchEvent) => {
      const start = swipeStartRef.current
      if (!start) return
      swipeStartRef.current = null
      const touch = event.changedTouches[0]
      const dx = touch.clientX - start.x
      const dy = Math.abs(touch.clientY - start.y)
      if (dx > 48 && dy < 40) setMenuOpen(true)
    }
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [menuOpen])

  if (!courseId) return null

  if (!course && loading) {
    return (
      <FullPage>
        <Spinner label="Загрузка курса" />
      </FullPage>
    )
  }

  if (!course && error) {
    return (
      <FullPage>
        <LoadState>
          <Text>Не удалось загрузить курс</Text>
          <Text muted>{error}</Text>
          <Button variant="secondary" onClick={load}>
            Повторить
          </Button>
        </LoadState>
      </FullPage>
    )
  }

  if (!course) return null

  return (
    <Shell>
      <SidebarSlot $open={menuOpen}>
        <CourseSidebarRoot
          courseId={courseId}
          courseTitle={course.name}
          onResourceSelect={(resourceId) => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setMenuOpen(false)
            navigate(`/course/${courseId}/resource/${resourceId}`)
          }}
        />
      </SidebarSlot>
      {menuOpen && <Overlay $open={menuOpen} onClick={() => setMenuOpen(false)} />}

      <Rail aria-label="Панель курса">
        {/* Настроек курса пока нет — временно ведём на главную */}
        <RailButton onClick={() => setMenuOpen(true)} aria-label="Открыть содержание">
          <PanelLeftOpen size={18} />
        </RailButton>
        <RailButton onClick={() => navigate('/home')} aria-label="Настройки курса">
          <Settings size={18} />
        </RailButton>
      </Rail>

      <Main>
        <Outlet />
      </Main>
    </Shell>
  )
}
