import { Menu } from 'lucide-react'
import { useState } from 'react'
import { CourseSidebar } from '@/features/sidebar'
import { CourseContent } from './CourseContent'
import { course, flattenLessons } from './course.data'
import { Main, MenuButton, MobileBar, Overlay, Shell, SidebarSlot } from './course.styles'

export function CoursePage() {
  const lessons = flattenLessons(course)
  const [activeId, setActiveId] = useState(
    () => lessons.find((lesson) => lesson.status === 'current')?.id ?? lessons[0].id,
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const index = lessons.findIndex((lesson) => lesson.id === activeId)
  const select = (id: string) => {
    setActiveId(id)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <Shell>
      <SidebarSlot $open={menuOpen}>
        <CourseSidebar
          courseId="course-react-basics"
          courseTitle="React Basics"
          courseSubtitle="Основы React: компоненты, состояние, эффекты."
          onResourceSelect={(resourceId) => {
            // TODO: навигация на страницу ресурса, когда будет роутинг
            console.log('resource selected:', resourceId)
          }}
        />
      </SidebarSlot>
      {menuOpen && <Overlay $open={menuOpen} onClick={() => setMenuOpen(false)} />}

      <Main>
        <MobileBar>
          <MenuButton onClick={() => setMenuOpen(true)}>
            <Menu size={18} />
            Содержание
          </MenuButton>
          <span>{lessons[index].title}</span>
        </MobileBar>
        <CourseContent
          lesson={lessons[index]}
          hasNext={index < lessons.length - 1}
          onNext={() => index < lessons.length - 1 && select(lessons[index + 1].id)}
        />
      </Main>
    </Shell>
  )
}
