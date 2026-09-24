import { Text } from '@mai/theme'
import styled from 'styled-components'

// ─────────────────────────  Корневая зона viewer  ─────────────────────────

export const ViewerRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'body')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
`

export const HeaderTitles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  margin-right: auto;
`

export const HeaderTitle = styled(Text)`
  font-weight: 600;
`

export const HeaderSubtitle = styled(Text).attrs({ color: 'muted' })``

// ─────────────────────────  Тело: граф + панель  ─────────────────────────

export const Body = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
`

export const GraphArea = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`

export const EmptyState = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`
