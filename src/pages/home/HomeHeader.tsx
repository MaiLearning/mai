import { Link } from 'react-router-dom'
import { useTranslation } from '@/app/i18n'
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

export function HomeHeader() {
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
          <Link to="/course">{t('header.nav.continue')}</Link>
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
