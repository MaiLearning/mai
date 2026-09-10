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
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.display};
  font-size: 1.25rem;
  font-weight: 700;
  padding: 4px 8px;
  margin: -4px -8px;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.colors.border};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 500;
  }
`

export const LanguageSelect = styled.select`
  height: 30px;
  padding: 0 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.8125rem;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`
