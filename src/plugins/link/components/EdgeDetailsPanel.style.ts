import styled from 'styled-components'
import { Badge } from '@/app/theme/components'

export const PanelRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 340px;
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  overflow-y: auto;
`

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

export const BrokenBadge = styled(Badge).attrs({ variant: 'danger' })``

export const Endpoints = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
`

export const EndpointLabel = styled.span`
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const TargetSection = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
`

export const PanelRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  align-items: center;

  & > button {
    flex: 1;
  }
`
