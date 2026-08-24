import { Link } from 'react-router-dom'
import { useTranslation } from '@/app/i18n'
import type { Course } from '@/entities/course'
import { HomeIcon } from './HomeIcon'
import {
  ActionLink,
  Actions,
  Brand,
  HeaderContainer,
  HeaderRoot,
  Mark,
  NavLinks,
} from './header.styles'

interface HomeHeaderProps {
  courses: Course[]
}

export function HomeHeader({ courses }: HomeHeaderProps) {
  const { t } = useTranslation('home')
  const byFreshness = [...courses].sort((a, b) => b.updatedAt - a.updatedAt)
  const continueCourse = byFreshness.find((c) => c.status === 'in_progress') ?? byFreshness[0]

  return (
    <HeaderRoot>
      <HeaderContainer>
        <Brand to="/home">
          <Mark>
            <HomeIcon name="spark" size={18} />
          </Mark>
          Mai
        </Brand>
        <NavLinks aria-label={t('header.nav.ariaLabel')}>
          <Link to="/home">{t('header.nav.myCourses')}</Link>
          {/* TODO: роут создания курса */}
          <Link to={continueCourse ? `/course/${continueCourse.id}` : '/course'}>
            {t('header.nav.continue')}
          </Link>
          <Link to="#how-it-works">{t('header.nav.howItWorks')}</Link>
        </NavLinks>
        <Actions>
          <ActionLink to="/course" $variant="ghost">
            {t('header.actions.signIn')}
          </ActionLink>
          <ActionLink to="/course">
            <HomeIcon name="plus" size={16} />
            {t('header.actions.newCourse')}
          </ActionLink>
        </Actions>
      </HeaderContainer>
    </HeaderRoot>
  )
}
