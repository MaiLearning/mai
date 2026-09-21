import styled from 'styled-components'

export const Root = styled.section`
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.background.surface};
  overflow: hidden;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.border.default};
`

export const Label = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.muted};
`

export const Value = styled.code`
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.primary};
`

export const Stream = styled.pre<{ $tone: 'stdout' | 'stderr' }>`
  margin: 0;
  padding: 12px 14px;
  max-height: 220px;
  overflow: auto;
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 0.8125rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  color: ${({ theme, $tone }) =>
    $tone === 'stderr' ? theme.status.danger.foreground : theme.text.primary};
`

export const Empty = styled.p`
  margin: 0;
  padding: 12px 14px;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.text.muted};
`
