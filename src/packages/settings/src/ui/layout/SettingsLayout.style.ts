import { themedScrollbar } from '@mai/theme'
import styled from 'styled-components'

/**
 * Каркас страницы настроек: навигация слева, содержимое справа. Занимает всю
 * высоту страницы (не «плавающая» панель); на узких экранах — вертикальная
 * раскладка.
 */
export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: 100%;
  min-height: 100vh;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: stretch;
  }
`

export const Sidebar = styled.aside`
  flex-shrink: 0;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'raised')};

  @media (min-width: 768px) {
    width: 280px;
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

  @media (min-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.xl}`};
  }
`
