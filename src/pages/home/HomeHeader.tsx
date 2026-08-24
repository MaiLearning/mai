import { Link } from 'react-router-dom'
import { useTranslation } from '@/app/i18n'
import { Button } from '@/app/theme/components'
import type { Course } from '@/entities/course'
import { Actions, Brand, HeaderContainer, HeaderRoot, Mark, NavLinks } from './HomeHeader.styles'
import { HomeIcon } from './HomeIcon'
import { ActionLink } from './shared.styles'

interface HomeHeaderProps {
  /** Курс для ссылки «Продолжить» (резолвится в useCourses). */
  continueCourse: Course | null
  /** Открыть модальное окно создания курса. */
  onCreateCourse: () => void
}

export function HomeHeader({ continueCourse, onCreateCourse }: HomeHeaderProps) {
  const { t } = useTranslation('home')

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
          <Link to={continueCourse ? `/course/${continueCourse.id}` : '/home'}>
            {t('header.nav.continue')}
          </Link>
          <Link to="#how-it-works">{t('header.nav.howItWorks')}</Link>
        </NavLinks>
        <Actions>
          <ActionLink to="/course" $variant="ghost">
            {t('header.actions.signIn')}
          </ActionLink>
          <Button onClick={onCreateCourse}>
            <HomeIcon name="plus" size={16} />
            {t('header.actions.newCourse')}
          </Button>
        </Actions>
      </HeaderContainer>
    </HeaderRoot>
  )
}
