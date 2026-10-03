import { useTranslation } from '@mai/i18n'
import { BookOpen, LayoutGrid, Settings, Sparkles, TerminalSquare } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  Content,
  ContentInner,
  Greeting,
  GreetingSub,
  Header,
  HeaderActions,
  HeaderText,
  MobileBrand,
  ShellInner,
  ShellRoot,
} from './HomeShell.style'
import {
  Brand,
  BrandMark,
  MobileNav,
  MobileNavGrid,
  MobileNavLabel,
  MobileNavLink,
  Nav,
  NavLink,
  RouteMobileLink,
  RouteNavLink,
  Sidebar,
} from './HomeShellNav.style'

interface HomeShellProps {
  /**
   * Имя пользователя для приветствия. Пока механики аккаунта нет, имя не
   * подставляется: перевод `greeting` не содержит плейсхолдера, а проп
   * оставлен швом под будущую модель пользователя.
   */
  userName?: string
  /**
   * Инициалы для аватара. Аватар — вместе с панелью уведомлений — пока
   * закомментирован, поэтому проп пока не читается.
   */
  userInitials: string
  children: ReactNode
}

/**
 * Каркас главной страницы по референсу: сайдбар слева (desktop),
 * хедер с приветствием, мобильная навигация снизу.
 */
export function HomeShell({ children }: HomeShellProps) {
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
            {/*
              TODO: раздел аналитики ещё не существует — ссылка ведёт в никуда.
              Вернуть вместе с импортами SlidersHorizontal (здесь) и BarChart3
              (в мобильной панели ниже): без них tsc падает на noUnusedLocals.
            */}
            {/* <NavLink href="#analytics">
              <SlidersHorizontal size={16} aria-hidden="true" />
              {t('nav.analytics')}
            </NavLink> */}
            <RouteNavLink to="/settings">
              <Settings size={16} aria-hidden="true" />
              {t('nav.settings')}
            </RouteNavLink>
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
                <Greeting>{t('greeting')}</Greeting>
                <GreetingSub>{t('greetingSubtitle')}</GreetingSub>
              </HeaderText>
              <HeaderActions>
                {/* TODO: панель уведомлений ещё не существует, поэтому закомментированно */}
                {/* <IconButton
                  type="button"
                  variant="outline"
                  onlyIcon={<Bell size={18} aria-hidden="true" />}
                  aria-label={t('notifications')}
                />
                <Avatar aria-hidden="true">{userInitials}</Avatar> */}
              </HeaderActions>
            </Header>
            {children}
          </ContentInner>
        </Content>
      </ShellInner>

      <MobileNav aria-label={t('nav.main')}>
        <MobileNavGrid>
          <MobileNavLink href="#courses" $active aria-current="page" aria-label={t('nav.overview')}>
            <LayoutGrid size={18} aria-hidden="true" />
            <MobileNavLabel>{t('nav.overview')}</MobileNavLabel>
          </MobileNavLink>
          <MobileNavLink href="#library" aria-label={t('nav.manage')}>
            <BookOpen size={18} aria-hidden="true" />
            <MobileNavLabel>{t('nav.manageShort')}</MobileNavLabel>
          </MobileNavLink>
          {/* TODO: раздел аналитики ещё не существует — ссылка ведёт в никуда. */}
          {/* <MobileNavLink href="#analytics" aria-label={t('nav.analytics')}>
            <BarChart3 size={18} aria-hidden="true" />
            <MobileNavLabel>{t('nav.analytics')}</MobileNavLabel>
          </MobileNavLink> */}
          <RouteMobileLink to="/settings" aria-label={t('nav.settings')}>
            <Settings size={18} aria-hidden="true" />
            <MobileNavLabel>{t('nav.settings')}</MobileNavLabel>
          </RouteMobileLink>
        </MobileNavGrid>
      </MobileNav>
    </ShellRoot>
  )
}
