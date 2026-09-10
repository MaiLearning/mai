import { Search } from 'lucide-react'
import styled from 'styled-components'

export const Root = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

export const SearchIcon = styled(Search)`
  display: inline-flex;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus-visible {
    outline: none;
  }
`

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  z-index: 10;
  display: flex;
  flex-direction: column;
  max-height: 60vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

export const Empty = styled.span`
  padding: ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const SectionHit = styled.div`
  display: flex;
  flex-direction: column;
`

export const SectionLabel = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  font-family: ${({ theme }) => theme.font.body};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primarySurface};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focus};
  }
`

export const SectionIcon = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const FieldHit = styled.button`
  padding: 6px ${({ theme }) => theme.spacing.sm} 6px 36px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  font-family: ${({ theme }) => theme.font.body};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primarySurface};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focus};
  }
`
