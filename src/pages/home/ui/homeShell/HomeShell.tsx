import { useTranslation } from '@mai/i18n'
import {
  BarChart3,
  Bell,
  BookOpen,
  LayoutGrid,
  SlidersHorizontal,
  Sparkles,
  TerminalSquare,
} from 'lucide-react'
import type { ReactNode } from 'react'
import {
  Avatar,
  Content,
  ContentInner,
  Greeting,
  GreetingSub,
  Header,
  HeaderActions,
  HeaderText,
  IconButton,
  MobileBrand,
  ShellInner,
  ShellRoot,
} from './HomeShell.style'
import {
  Brand,
  BrandMark,
  MobileNav,
  MobileNavGrid,
  MobileNavLink,
  Nav,
  NavLink,
  Sidebar,
} from './HomeShellNav.style'

interface HomeShellProps {
  /** Имя пользователя в приветствии. */
  userName: string
  /** Инициалы для аватара. */
  userInitials: string
  children: ReactNode
}

/**
 * Каркас главной страницы по референсу: сайдбар слева (desktop),
 * хедер с приветствием, мобильная навигация снизу.
 */
export function HomeShell({ userName, userInitials, children }: HomeShellProps) {
  const { t } = useTranslation('home')

  return (
    <ShellRoot>
      <ShellInner>
        <Sidebar>
          <Brand>
            <BrandMark>
              <Sparkles size={16} aria-hidden="true" />
            </BrandMark>
            {t('brand')}
          </Brand>
          <Nav>
            <NavLink href="#courses" $active aria-current="page">
              <LayoutGrid size={16} aria-hidden="true" />
              {t('nav.overview')}
            </NavLink>
            <NavLink href="#library">
              <BookOpen size={16} aria-hidden="true" />
              {t('nav.manage')}
            </NavLink>
            {/* TODO: раздел аналитики ещё не существует — ссылка ведёт в никуда */}
            <NavLink href="#analytics">
              <SlidersHorizontal size={16} aria-hidden="true" />
              {t('nav.analytics')}
            </NavLink>
          </Nav>
        </Sidebar>

        <Content>
          <ContentInner>
            <Header>
              <HeaderText>
                <MobileBrand>
                  <TerminalSquare size={14} aria-hidden="true" />
                  {t('brand')}
                </MobileBrand>
                <Greeting>{t('greeting', { name: userName })}</Greeting>
                <GreetingSub>{t('greetingSubtitle')}</GreetingSub>
              </HeaderText>
              <HeaderActions>
                {/* TODO: панель уведомлений ещё не существует */}
                <IconButton
                  type="button"
                  variant="outline"
                  onlyIcon={<Bell size={18} aria-hidden="true" />}
                  aria-label={t('notifications')}
                />
                <Avatar aria-hidden="true">{userInitials}</Avatar>
              </HeaderActions>
            </Header>
            {children}
          </ContentInner>
        </Content>
      </ShellInner>

      <MobileNav aria-label={t('nav.main')}>
        <MobileNavGrid>
          <MobileNavLink href="#courses" $active>
            <LayoutGrid size={18} aria-hidden="true" />
            {t('nav.overview')}
          </MobileNavLink>
          <MobileNavLink href="#library">
            <BookOpen size={18} aria-hidden="true" />
            {t('nav.manage')}
          </MobileNavLink>
          <MobileNavLink href="#analytics">
            <BarChart3 size={18} aria-hidden="true" />
            {t('nav.analytics')}
          </MobileNavLink>
        </MobileNavGrid>
      </MobileNav>
    </ShellRoot>
  )
}
