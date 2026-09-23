import styled from 'styled-components'

export const ProgressTrack = styled.div`
  position: relative;
  height: 8px;
  width: 100%;
  background: ${({ theme }) => theme.utils.withState(theme.utils.getBackground('neutral', 'raised'), 'disabledAlpha')};
  border-radius: ${({ theme }) => theme.radius.full};
  overflow: hidden;
`

export interface ProgressFillStyledProps {
  $percent: number
}

export const ProgressFill = styled.div<ProgressFillStyledProps>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${({ theme }) => theme.utils.getSolid('accent', 'base')};
  border-radius: inherit;
  transition: width ${({ theme }) => theme.durations.normal} ease;
`
