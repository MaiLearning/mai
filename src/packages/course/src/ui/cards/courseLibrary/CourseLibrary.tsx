import { useTranslation } from '@mai/i18n'
import { Button, Heading, Icon, SearchField, Text, Tooltip } from '@mai/theme'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Course } from '../../../core'
import { CourseGridCard } from '../courseGridCard/CourseGridCard'
import {
  CreateCard,
  CreateIcon,
  EmptyState,
  Library,
  LibraryGrid,
  LibraryHead,
  LibraryTitles,
  SearchWrap,
  Toolbar,
  ViewToggleResponsive,
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
        <LibraryTitles>
          <Heading as="h2" size="lg">
            {t('coursesSection.libraryTitle')}
          </Heading>
          <Text as="p" size="sm" color="muted">
            {t('coursesSection.libraryAvailable', { count: filtered.length })}
          </Text>
        </LibraryTitles>
        <ViewToggleResponsive
          value={compact ? 'compact' : 'grid'}
          onChange={(next) => setCompact(next === 'compact')}
          items={[
            { value: 'grid', label: t('coursesSection.viewGrid') },
            { value: 'compact', label: t('coursesSection.viewCompact') },
          ]}
          aria-label={t('coursesSection.viewLabel')}
        />
      </LibraryHead>

      <Toolbar>
        <SearchWrap>
          <SearchField
            aria-label={t('coursesSection.searchLabel')}
            placeholder={t('coursesSection.searchPlaceholder')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </SearchWrap>
        {/* TODO: панель фильтров ещё не спроектирована */}
        <Tooltip content={t('coursesSection.filters')}>
          <Button
            type="button"
            variant="outline"
            onlyIcon={<SlidersHorizontal size={16} aria-hidden="true" />}
            aria-label={t('coursesSection.filters')}
          />
        </Tooltip>
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
                <Icon name="plus" size={24} aria-hidden="true" />
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
