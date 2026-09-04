import styled from 'styled-components'
import { Text } from '@/app/theme/components'

// ─────────────────────────  Корневая зона viewer  ─────────────────────────

export const ViewerRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  background: ${({ theme }) => theme.colors.body};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.body};
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
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

export const HeaderSubtitle = styled(Text).attrs({ muted: true })``

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
  color: ${({ theme }) => theme.colors.textMuted};
`
