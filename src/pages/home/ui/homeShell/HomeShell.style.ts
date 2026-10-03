import { Button } from '@mai/theme'
import styled from 'styled-components'
import { MOBILE_NAV_RESERVE } from './HomeShellNav.style'

/** Каркас главной: сайдбар слева (только lg+), контент по центру, мобильная навигация снизу. */
export const ShellRoot = styled.div`
  /* box-sizing обязателен: глобального сброса border-box в приложении нет, а
     без него min-height: 100vh ограничивает контентный бокс, и padding-bottom
     под мобильную панель уходил за пределы окна — документ всегда
     прокручивался на лишние MOBILE_NAV_RESERVE пикселей. */
  box-sizing: border-box;
  min-height: 100vh;
  overflow-x: clip;
  container-type: inline-size;
  container-name: home-shell;
  padding-bottom: ${MOBILE_NAV_RESERVE}px;
  /* Медиазапрос, а не @container home-shell: ShellRoot сам является этим
     контейнером, а элемент не резолвится против собственного контейнера —
     запрос не срабатывал никогда, и резерв висел внизу на всех ширинах.
     Ширина ShellRoot равна ширине вьюпорта, поэтому для него обе формы
     эквивалентны. */
  @media (min-width: 1200px) {
    padding-bottom: 0;
  }
`

export const ShellInner = styled.div`
  display: flex;
  width: 100%;
`

export const Content = styled.section`
  min-width: 0;
  flex: 1;
  container-type: inline-size;
  container-name: content;
`

/** Центрирующая оболочка: контент всегда по центру с полями слева/справа. */
export const ContentInner = styled.div`
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 24px 20px 64px;
  @container content (min-width: 560px) {
    padding: 24px 32px 64px;
  }
  @container content (min-width: 1024px) {
    padding: 32px 48px 64px;
  }
`

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 28px;
  border-bottom: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  @container content (min-width: 768px) {
    align-items: center;
  }
`

export const HeaderText = styled.div`
  min-width: 0;
`

export const MobileBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  svg {
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
  }
  @container home-shell (min-width: 1200px) {
    display: none;
  }
`

export const Greeting = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  @container content (min-width: 560px) {
    font-size: 24px;
  }
  @container content (min-width: 768px) {
    font-size: 30px;
  }
`

export const GreetingSub = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`

export const HeaderActions = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

/** Кнопка-иконка шапки: тема `Button`, приведённая к квадрату 40×40. */
export const IconButton = styled(Button)`
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }
`

export const Avatar = styled.div`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.utils.getSolid('accent', 'hover')},
    ${({ theme }) => theme.utils.getSolid('accent', 'base')}
  );
  color: ${({ theme }) => theme.contrastText.accent};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
`
