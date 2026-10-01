import { Button } from '@mai/theme'
import styled from 'styled-components'

export const Shell = styled.div`
  display: grid;
  min-height: 100vh;
  /* Первая колонка — вертикальная панель курса, вторая — контент */
  grid-template-columns: 48px 1fr;
  @media (min-width: 1024px) {
    grid-template-columns: 288px 1fr;
  }
`
export const SidebarSlot = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 20;
  transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
  transition: transform 0.25s ease;
  @media (min-width: 1024px) {
    position: sticky;
    top: 0;
    height: 100vh;
    transform: none;
  }
`
export const Main = styled.main`
  min-width: 0;
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'body')};
  container-type: inline-size;
  container-name: course-main;
`
export const Overlay = styled.button<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 19;
  border: 0;
  /* TODO: скрим не покрыт контрактом темы — нет токена полупрозрачного слоя.
     По-хорошему добавить токен в тему и заменить color-mix на theme.utils.*. */
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.utils.getBackground('neutral', 'body')} 40%,
    transparent
  );
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  @media (min-width: 1024px) {
    display: none;
  }
`
/**
 * Вертикальная панель курса для узких экранов: постоянная узкая колонка
 * у левого края с кнопками сверху вниз («Открыть» содержание, «Настройки»).
 * На десктопе (>=lg) не отображается — там сайдбар является постоянной колонкой.
 */
export const Rail = styled.nav`
  position: sticky;
  top: 0;
  /* box-sizing обязателен: глобального сброса border-box в приложении нет,
     и в content-box высота 100vh складывалась с padding-top, выдавая
     документу лишние пиксели высоты и скроллбар окна на всей странице. */
  box-sizing: border-box;
  height: 100vh;
  z-index: 11;
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-top: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  border-right: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};

  @media (max-width: 1023px) {
    display: flex;
  }
`

/** Кнопка-иконка вертикальной панели: тема `Button`, приведённая к квадрату 40×40. */
export const RailButton = styled(Button)`
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
    background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
  }
`
