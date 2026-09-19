import styled from 'styled-components'

export const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  width: 288px;
  height: 100%;
  min-height: 0;
  border-right: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
  border-bottom: 1px solid ${({ theme }) => theme.border.default};
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
  border-top: 1px solid ${({ theme }) => theme.border.default};
`

export const Mark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.background.accentSubtle};
  color: ${({ theme }) => theme.background.accent};
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
    background: ${({ theme }) => theme.background.accent};
    color: ${({ theme }) => theme.text.onPrimary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
    outline-offset: 2px;
  }
`

export const HeaderText = styled.div`
  min-width: 0;
`

export const CourseTitle = styled.h2`
  overflow: hidden;
  margin: 0;
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Meta = styled.p`
  margin: 2px 0 0;
  color: ${({ theme }) => theme.text.muted};
  font-size: 11.5px;
  line-height: 1.3;
`

export const SearchRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md} 0`};
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.background.body};
  transition: border-color ${({ theme }) => theme.durations.fast};

  &:focus-within {
    border-color: ${({ theme }) => theme.focus.ring};
  }
`

export const SearchIconSlot = styled.span`
  display: inline-flex;
  padding-left: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.text.muted};
`

export const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  padding: 6px 8px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text.primary};
  font-family: inherit;
  font-size: 12.5px;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.text.muted};
  }

  &::-webkit-search-cancel-button {
    display: none;
  }
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
  color: ${({ theme }) => theme.text.muted};

  &:hover {
    background: ${({ theme }) => theme.background.elevated};
    color: ${({ theme }) => theme.text.primary};
  }
`
