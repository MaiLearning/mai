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

export const FallbackCard = styled.div`
  display: flex;
  flex-direction: column;
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
  background: ${({ theme }) => theme.background.accentSubtle};
  color: ${({ theme }) => theme.text.accent};
`

export const FallbackTitle = styled.strong`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`

export const FallbackDescription = styled.p`
  margin: -6px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: ${({ theme }) => theme.text.muted};
`

export const TypeChip = styled.code`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px;
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text.muted};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 11.5px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

export const TypeChipLabel = styled.span`
  text-transform: none;
  opacity: 0.65;
`
