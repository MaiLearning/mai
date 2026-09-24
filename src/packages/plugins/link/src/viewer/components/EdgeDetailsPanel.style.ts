import { Badge } from '@mai/theme'
import styled from 'styled-components'

export const PanelRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 340px;
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border-left: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  overflow-y: auto;
`

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
`

export const BrokenBadge = styled(Badge).attrs({ tone: 'danger' })``

export const Endpoints = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
`

export const EndpointLabel = styled.span`
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`

export const TargetSection = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px dashed ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
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
