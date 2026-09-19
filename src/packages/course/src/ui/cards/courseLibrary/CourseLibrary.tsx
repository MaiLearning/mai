import { useTranslation } from '@mai/i18n'
import { LayoutGrid, ListFilter, Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Course } from '../../../core'
import { CourseGridCard } from '../courseGridCard/CourseGridCard'
import { HomeIcon } from '../HomeIcon'
import {
  CreateCard,
  CreateIcon,
  EmptyState,
  FilterButton,
  Library,
  LibraryGrid,
  LibraryHead,
  SearchInput,
  SearchWrap,
  Toolbar,
  ViewButton,
  ViewToggle,
} from './CourseLibrary.style'

interface CourseLibraryProps {
  courses: Course[]
  lessonCounts: Record<string, number>
  /** Открыть модальное окно создания курса. */
  onCreateCourse: () => void
  /** Открыть модальное окно настроек курса. */
  onEditCourse: (course: Course) => void
  /** Открыть курс (навигацию выполняет потребитель). */
  onOpenCourse: (course: Course) => void
}

/**
 * Блок «Все курсы» по референсу: поиск по названию/описанию/тегам,
 * переключатель сетка/список, empty-state при пустом результате.
 */
export function CourseLibrary({
  courses,
  lessonCounts,
  onCreateCourse,
  onEditCourse,
  onOpenCourse,
}: CourseLibraryProps) {
  const { t } = useTranslation('course')
  const [query, setQuery] = useState('')
  const [compact, setCompact] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return courses

    return courses.filter((course) =>
      `${course.name} ${course.description} ${course.tags.join(' ')}`.toLowerCase().includes(q),
    )
  }, [courses, query])

  return (
    <Library id="library">
      <LibraryHead>
        <div>
          <h2>{t('coursesSection.libraryTitle')}</h2>
          <p>{t('coursesSection.libraryAvailable', { count: filtered.length })}</p>
        </div>
        <ViewToggle role="group" aria-label={t('coursesSection.viewLabel')}>
          <ViewButton
            type="button"
            $active={!compact}
            aria-label={t('coursesSection.viewGrid')}
            aria-pressed={!compact}
            onClick={() => setCompact(false)}
          >
            <LayoutGrid size={15} aria-hidden="true" />
          </ViewButton>
          <ViewButton
            type="button"
            $active={compact}
            aria-label={t('coursesSection.viewCompact')}
            aria-pressed={compact}
            onClick={() => setCompact(true)}
          >
            <ListFilter size={15} aria-hidden="true" />
          </ViewButton>
        </ViewToggle>
      </LibraryHead>

      <Toolbar>
        <SearchWrap>
          <Search size={16} aria-hidden="true" />
          <SearchInput
            type="search"
            aria-label={t('coursesSection.searchLabel')}
            placeholder={t('coursesSection.searchPlaceholder')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </SearchWrap>
        {/* TODO: панель фильтров ещё не спроектирована */}
        <FilterButton type="button" aria-label={t('coursesSection.filters')}>
          <SlidersHorizontal size={16} aria-hidden="true" />
        </FilterButton>
      </Toolbar>

      {filtered.length === 0 ? (
        <EmptyState>
          <Search size={24} aria-hidden="true" />
          <p>{t('coursesSection.emptyTitle')}</p>
          <span>{t('coursesSection.emptyHint')}</span>
        </EmptyState>
      ) : (
        <LibraryGrid $compact={compact}>
          {filtered.map((course) => (
            <CourseGridCard
              key={course.id}
              course={course}
              lessons={lessonCounts[course.id]}
              onEdit={onEditCourse}
              onOpen={onOpenCourse}
            />
          ))}
          {!query && (
            <CreateCard type="button" onClick={onCreateCourse}>
              <CreateIcon>
                <HomeIcon name="plus" size={24} />
              </CreateIcon>
              <strong>{t('coursesSection.createCard.title')}</strong>
              <span>{t('coursesSection.createCard.subtitle')}</span>
            </CreateCard>
          )}
        </LibraryGrid>
      )}
    </Library>
  )
}
