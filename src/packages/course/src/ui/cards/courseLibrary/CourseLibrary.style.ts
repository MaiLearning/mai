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
  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.text.primary};
  }
  p {
    margin: 4px 0 0;
    font-size: 14px;
    color: ${({ theme }) => theme.text.muted};
  }
`

export const ViewToggle = styled.div`
  display: none;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  @container library (min-width: 420px) {
    display: flex;
  }
`

export const ViewButton = styled.button<{ $active?: boolean }>`
  cursor: pointer;
  display: grid;
  place-items: center;
  padding: 6px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $active }) => ($active ? theme.background.selected : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.text.primary : theme.text.muted)};
  &:hover {
    color: ${({ theme }) => theme.text.primary};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
    outline-offset: 2px;
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
  position: relative;
  min-width: 0;
  width: 100%;
  max-width: 360px;
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.text.muted};
    pointer-events: none;
  }
`

export const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px 0 36px;
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text.primary};
  font-size: 14px;
  font-family: inherit;
  outline: none;
  &::placeholder {
    color: ${({ theme }) => theme.text.muted};
    opacity: 0.7;
  }
  &:focus {
    border-color: ${({ theme }) => theme.border.accent};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.background.accentSubtle};
  }
`

export const FilterButton = styled.button`
  cursor: pointer;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.text.muted};
  &:hover {
    background: ${({ theme }) => theme.background.hover};
    color: ${({ theme }) => theme.text.primary};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
    outline-offset: 2px;
  }
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
  border: 1px dashed ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.lg};
  text-align: center;
  color: ${({ theme }) => theme.text.muted};
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
    opacity: 0.7;
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
  border: 2px dashed ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: transparent;
  color: ${({ theme }) => theme.text.muted};
  text-align: center;
  transition:
    border-color 0.16s ease,
    color 0.16s ease,
    background 0.16s ease;
  strong {
    color: ${({ theme }) => theme.text.primary};
    font-size: 16px;
  }
  span {
    max-width: 28ch;
    font-size: 13.5px;
  }
  &:hover {
    border-color: ${({ theme }) => theme.border.accent};
    color: ${({ theme }) => theme.text.accent};
    background: ${({ theme }) => theme.background.accentSubtle}55;
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
    outline-offset: 2px;
  }
`

export const CreateIcon = styled.span`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.background.accentSubtle};
  color: ${({ theme }) => theme.text.accent};
`
