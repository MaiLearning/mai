import styled from 'styled-components'

/** Строка шапки: название ресурса + справа переключатель режимов. */
export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`

export const TitleInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1.25rem;
  font-weight: 700;
  padding: 4px 8px;
  margin: -4px -8px;
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.border.default};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.border.accent};
    background: ${({ theme }) => theme.background.surface};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.muted};
    font-weight: 500;
  }
`

export const LanguageSelect = styled.select`
  height: 30px;
  padding: 0 8px;
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.8125rem;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.border.accent};
  }
`
