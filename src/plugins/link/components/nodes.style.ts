import { Handle } from '@xyflow/react'
import styled, { css } from 'styled-components'

const cardBase = css`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 200px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  font-family: ${({ theme }) => theme.font.body};
`

/** Узел-курс; текущий курс выделен акцентной рамкой. */
export const CourseCard = styled.div<{ $current: boolean }>`
  ${cardBase};
  border-color: ${({ theme, $current }) => ($current ? theme.colors.accent : theme.colors.border)};
  background: ${({ theme, $current }) =>
    $current ? theme.colors.accentSurface : theme.colors.surfaceElevated};
`

/** Узел-ресурс. */
export const ResourceCard = styled.div`
  ${cardBase};
`

/** Узел внешнего URI. */
export const UriCard = styled.div`
  ${cardBase};
  border-style: dashed;
`

export const NodeKind = styled.span`
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const NodeLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const NodeSublabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const GraphHandle = styled(Handle)`
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.colors.borderStrong};
  border: none;
`
