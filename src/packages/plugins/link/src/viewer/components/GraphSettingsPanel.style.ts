import { themedScrollbar } from '@mai/theme'
import styled from 'styled-components'

/** Панель настроек внутри правой колонки оверлея. */
export const Panel = styled.div`
  box-sizing: border-box;
  /* min-height: 0 обязателен: без него flex-позиция не сожмётся под max-height
     рейла, и панель вылезет под обрезку холста. */
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 260px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow-y: auto;

  ${themedScrollbar}
`

/**
 * Строка настройки в две строки: подпись со значением сверху, слайдер под ними.
 * Подпись и слайдер на одной строке не уживались — длинная подпись
 * («Притяжение к центру») вытесняла range-инпут за пределы панели.
 */
export const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

/** Шапка строки: подпись слева, текущее значение справа. */
export const RowHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const RowLabel = styled.span`
  min-width: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const RowValue = styled.span`
  flex-shrink: 0;
  min-width: 44px;
  text-align: right;
  font-size: 11px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-variant-numeric: tabular-nums;
`

/** Слайдер на всю ширину панели: интринзитная ширина range-инпута его выдавливала. */
export const Slider = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 4px;
  margin: 0;
  appearance: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  outline: none;
  cursor: pointer;

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
