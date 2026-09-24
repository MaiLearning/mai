import styled from 'styled-components'

/** Панель настроек внутри правой колонки оверлея. */
export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 240px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const RowLabel = styled.span`
  flex: 1;
  font-size: 12px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  white-space: nowrap;
`

export const RowValue = styled.span`
  min-width: 36px;
  text-align: right;
  font-size: 11px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-variant-numeric: tabular-nums;
`

export const Slider = styled.input`
  flex: 1.2;
  height: 4px;
  appearance: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${({ theme }) => theme.utils.getSolid('accent', 'base')};
    border: 2px solid ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ theme }) => theme.utils.getSolid('accent', 'base')};
    border: 2px solid ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
    cursor: pointer;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
  }
`
