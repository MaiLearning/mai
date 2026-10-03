import type { AppTheme } from '@mai/theme'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

/**
 * Высота одного пункта нижней панели: padding 8 + icon 18 + gap 4 +
 * строка подписи 15 + padding 8. Задаётся ссылке как `min-height`, чтобы
 * число было не предположением, а величиной, которую обеспечивает раскладка.
 */
const MOBILE_NAV_LINK_HEIGHT = 53

/**
 * Резерв под мобильную панель в контенте страницы: border-top 1 + padding-top 8
 * оверлея + пункт + padding-bottom 12. Считается от `MOBILE_NAV_LINK_HEIGHT`,
 * поэтому панель и `padding-bottom` в ShellRoot не могут разойтись — раньше там
 * стоял хардкод 76px, и любая правка подписи (перенос на вторую строку)
 * перекрывала собой низ контента.
 *
 * `env(safe-area-inset-bottom)` в резерв не входит: в десктопном окне он нулевой,
 * а на мобильном панель утолщается вместе с системным отступом.
 */
export const MOBILE_NAV_RESERVE = 1 + 8 + MOBILE_NAV_LINK_HEIGHT + 12

export const Sidebar = styled.aside`
  display: none;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  width: 256px;
  padding: 24px 20px;
  border-right: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  @container home-shell (min-width: 1200px) {
    display: block;
  }
`

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
`

export const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getSolid('accent', 'base')};
  color: ${({ theme }) => theme.contrastText.accent};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

export const Nav = styled.nav`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
`

export const NavLink = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  text-decoration: none;
  font-weight: ${({ $active, theme }) =>
    $active ? theme.typography.weights.semibold : theme.typography.weights.regular};
  color: ${({ theme, $active }) =>
    $active ? theme.utils.getText('neutral', 'primary') : theme.utils.getText('neutral', 'muted')};
  background: ${({ theme, $active }) =>
    $active
      ? theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'selectedAlpha')
      : 'transparent'};
  transition: background ${({ theme }) => theme.durations.fast};
  &:hover {
    background: ${({ theme, $active }) =>
      theme.utils.withState(
        theme.utils.getBackground('neutral', 'surface'),
        $active ? 'selectedAlpha' : 'hoverAlpha',
      )};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }
`

export const RouteNavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  text-decoration: none;
  font-weight: ${({ $active, theme }) =>
    $active ? theme.typography.weights.semibold : theme.typography.weights.regular};
  color: ${({ theme, $active }) =>
    $active ? theme.utils.getText('neutral', 'primary') : theme.utils.getText('neutral', 'muted')};
  background: ${({ theme, $active }) =>
    $active
      ? theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'selectedAlpha')
      : 'transparent'};
  transition: background ${({ theme }) => theme.durations.fast};
  &:hover:not(:disabled) {
    background: ${({ theme, $active }) =>
      theme.utils.withState(
        theme.utils.getBackground('neutral', 'surface'),
        $active ? 'selectedAlpha' : 'hoverAlpha',
      )};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }
`

export const MobileNav = styled.nav`
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: ${({ theme }) => theme.zIndex.popover};
  padding: 8px 12px max(12px, env(safe-area-inset-bottom));
  border-top: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
  @container home-shell (min-width: 1200px) {
    display: none;
  }
`

/**
 * Пункты нижней панели — flex, а не grid с фиксированным числом колонок:
 * колонок ровно столько, сколько пунктов, и возвращение закомментированного
 * раздела «Аналитика» не потребует правки раскладки.
 */
export const MobileNavGrid = styled.div`
  margin: 0 auto;
  display: flex;
  max-width: 28rem;
  gap: 4px;
`

/**
 * Общая часть ссылки нижней панели для обычной ссылки и `Link` из роутера.
 *
 * `box-sizing: border-box` обязателен: глобального сброса border-box в
 * приложении нет, и в content-box `min-height` задал бы высоту контентного
 * бокса — панель стала бы выше `MOBILE_NAV_RESERVE`.
 *
 * `min-width: 0` обязателен по той же причине, по которой он нужен в grid:
 * иначе длинная подпись (min-content) распирает колонку, и пункты перестают
 * делить ширину поровну.
 */
const mobileNavLinkCss = css`
  box-sizing: border-box;
  min-width: 0;
  flex: 1 1 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: ${MOBILE_NAV_LINK_HEIGHT}px;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.md};
  text-decoration: none;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme, $active }: { theme: AppTheme; $active?: boolean }) =>
    $active ? theme.utils.getText('neutral', 'primary') : theme.utils.getText('neutral', 'muted')};
  &:hover:not(:disabled) {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'hoverAlpha')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }
`

export const MobileNavLink = styled.a<{ $active?: boolean }>`
  ${mobileNavLinkCss}
`

export const RouteMobileLink = styled(Link)<{ $active?: boolean }>`
  ${mobileNavLinkCss}
`

/**
 * Подпись пункта нижней панели. Никогда не переносится и не расталкивает
 * панель: слишком длинный перевод обрезается многоточием, а доступное имя
 * остаётся полным за счёт `aria-label` на ссылке.
 */
export const MobileNavLabel = styled.span`
  max-width: 100%;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
