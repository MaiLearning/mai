import { themedScrollbar } from '@mai/theme'
import styled from 'styled-components'

export const Root = styled.section`
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  overflow: hidden;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
`

export const Label = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`

export const Value = styled.code`
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
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
    $tone === 'stderr'
      ? theme.utils.getText('danger', 'primary')
      : theme.utils.getText('neutral', 'primary')};

  ${themedScrollbar}
`

export const Empty = styled.p`
  margin: 0;
  padding: 12px 14px;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`
