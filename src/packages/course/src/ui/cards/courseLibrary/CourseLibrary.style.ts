import { SegmentedControl } from '@mai/theme'
import styled, { css } from 'styled-components'

/** Блок «Все курсы»: заголовок, тулбар поиска, сетка, empty-state. */
export const Library = styled.div`
  margin-top: 40px;
  container-type: inline-size;
  container-name: library;
`

export const LibraryHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

/** Блок заголовка секции: подпись и пояснение. */
export const LibraryTitles = styled.div`
  display: grid;
  gap: 4px;
`

/** Переключатель сетка/список — только когда библиотеке хватает ширины. */
export const ViewToggleResponsive = styled(SegmentedControl)`
  display: none;
  @container library (min-width: 420px) {
    display: flex;
  }
`

export const Toolbar = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

export const SearchWrap = styled.div`
  min-width: 0;
  width: 100%;
  max-width: 360px;
`

export const LibraryGrid = styled.div<{ $compact?: boolean }>`
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  ${({ $compact }) =>
    !$compact &&
    css`
      @container library (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @container library (min-width: 960px) {
        grid-template-columns: repeat(3, 1fr);
      }
    `}
`

export const EmptyState = styled.div`
  margin-top: 20px;
  padding: 64px 16px;
  border: 1px dashed ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.lg};
  text-align: center;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  svg {
    margin: 0 auto;
  }
  p {
    margin: 12px 0 0;
    font-size: 14px;
  }
  span {
    display: block;
    margin-top: 4px;
    font-size: 12px;
  }
`

/** Пунктирная карточка создания курса в конце сетки. */
export const CreateCard = styled.button`
  cursor: pointer;
  font-family: inherit;
  min-height: 220px;
  display: grid;
  place-items: center;
  gap: 12px;
  padding: 32px;
  border: 2px dashed ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: transparent;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  text-align: center;
  transition:
    border-color 0.16s ease,
    color 0.16s ease,
    background 0.16s ease;
  strong {
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
    font-size: 16px;
  }
  span {
    max-width: 28ch;
    font-size: 13.5px;
  }
  &:hover {
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('accent', 'surface'), 'hoverAlpha')};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 2px;
  }
`

export const CreateIcon = styled.span`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
  color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
`
