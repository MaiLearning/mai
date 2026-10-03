import { themedScrollbar } from '@mai/theme'
import styled from 'styled-components'

/**
 * Порог раскладки в rem: ниже — навигация над содержимым, выше — колонка
 * слева. Задан в rem, как пороги контейнера в Container, чтобы решение
 * не зависело от настроек масштаба шрифта пользователя.
 */
const LAYOUT_BREAKPOINT = '48rem'

/**
 * Обёртка каркаса: держит высоту страницы и объявляет контейнерный запрос.
 *
 * Отдельный элемент нужен потому, что контейнер не запрашивает сам себя:
 * объявленный здесь `container-type` не может переключить раскладку `Layout`
 * — только раскладку его потомков.
 */
export const Root = styled.div`
  container-type: inline-size;
  container-name: settings-layout;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: 100%;
  min-height: 100vh;
`

/**
 * Каркас страницы настроек: навигация слева, содержимое справа. Занимает всю
 * высоту страницы (не «плавающая» панель); на узких экранах — вертикальная
 * раскладка. Порог берётся у `Root`, а не у вьюпорта: каркас решает по
 * доступной ему ширине и остаётся верным, если страницу вложат в узкую
 * колонку.
 */
export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: 100%;

  @container settings-layout (min-width: ${LAYOUT_BREAKPOINT}) {
    flex-direction: row;
    align-items: stretch;
  }
`

/**
 * Колонка навигации. На широкой раскладке её ширину задаёт потребитель
 * через `navWidth`: значение приходит готовой строкой и здесь не
 * интерпретируется — решение о габаритах остаётся за страницей.
 */
export const Sidebar = styled.aside<{ $navWidth: string }>`
  flex-shrink: 0;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'raised')};

  @container settings-layout (min-width: ${LAYOUT_BREAKPOINT}) {
    width: ${({ $navWidth }) => $navWidth};
    padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
    border-right: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
    border-bottom: 0;
    overflow-y: auto;
  }

  ${themedScrollbar}
`

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};

  @container settings-layout (min-width: ${LAYOUT_BREAKPOINT}) {
    padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.xl}`};
  }
`
