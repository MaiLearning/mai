import styled from 'styled-components'

export const Root = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 240px;
  flex-shrink: 0;
  height: 100vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

export const Title = styled.span`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.font.display};
  font-size: ${({ theme }) => theme.typography.headings.h4.fontSize};
  font-weight: ${({ theme }) => theme.typography.headings.h4.fontWeight};
  color: ${({ theme }) => theme.colors.text};
`

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const GroupHeader = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const Item = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme, $active }) => ($active ? theme.colors.primarySurface : 'transparent')};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text)};
  text-align: left;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.colors.primarySurface : theme.colors.surfaceElevated)};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focus};
  }
`

export const ItemIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
`

export const IconLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
