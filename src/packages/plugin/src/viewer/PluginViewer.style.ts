import { Card } from '@mai/theme'
import styled from 'styled-components'

export const ViewerRoot = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
`

// --- Fallback: ресурс нечем отобразить ---

export const MessageRoot = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
  padding: 32px;
`

export const FallbackCard = styled(Card)`
  align-items: center;
  gap: 14px;
  max-width: 420px;
  padding: 40px 28px;
  text-align: center;
`

export const FallbackIcon = styled.span`
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
  color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
`

export const TypeChip = styled.code`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'raised')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 11.5px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

export const TypeChipLabel = styled.span`
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  text-transform: none;
`
