import styled from 'styled-components'

export const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  width: 288px;
  height: 100%;
  min-height: 0;
  border-right: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
  border-bottom: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
`

/** Основная область: поиск и дерево структуры. */
export const Main = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
`

/** Нижняя панель с действиями курса. */
export const Footer = styled.footer`
  flex-shrink: 0;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-top: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
`

export const Mark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
  color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.02em;
`

/** Ссылка-обёртка метки: клик ведёт к обзору курса (/course/:courseId). */
export const MarkLink = styled.a`
  display: inline-flex;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.lg};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.durations.fast};

  &:hover {
    transform: translateY(-1px);
  }

  &:hover ${Mark} {
    background: ${({ theme }) => theme.utils.getSolid('accent', 'base')};
    color: ${({ theme }) => theme.contrastText.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 2px;
  }
`

export const HeaderText = styled.div`
  min-width: 0;
`

export const CourseTitle = styled.h2`
  overflow: hidden;
  margin: 0;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Meta = styled.p`
  margin: 2px 0 0;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: 11.5px;
  line-height: 1.3;
`

/** Обёртка поиска: отступ по образцу прежней рамки поиска. */
export const SearchWrap = styled.div`
  flex-shrink: 0;
  margin: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md} 0`};
`

export const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-right: 4px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};

  &:hover {
    background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }
`
