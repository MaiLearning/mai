import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  width: 288px;
  height: 100%;
  min-height: 0;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.body};
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const Mark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.primarySurface};
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.font.display};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
`

/** Ссылка-обёртка метки: клик ведёт к обзору курса (/course/:courseId). */
export const MarkLink = styled(Link)`
  display: inline-flex;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-1px);
  }

  &:hover ${Mark} {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textOnPrimary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`

export const HeaderText = styled.div`
  min-width: 0;
`

export const CourseTitle = styled.h2`
  overflow: hidden;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.display};
  font-size: ${({ theme }) => theme.typography.headings.h6.fontSize};
  font-weight: 600;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Meta = styled.p`
  margin: 2px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11.5px;
  line-height: 1.3;
`

export const SearchRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md} 0`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.body};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.focus};
  }
`

export const SearchIconSlot = styled.span`
  display: inline-flex;
  padding-left: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  padding: 6px 8px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 12.5px;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
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
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceElevated};
    color: ${({ theme }) => theme.colors.text};
  }
`

export const Scroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.borderStrong};
    background-clip: content-box;
  }
`
