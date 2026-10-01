import { Select } from '@mai/theme'
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
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1.25rem;
  font-weight: 700;
  padding: 4px 8px;
  margin: -4px -8px;
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
    background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  }

  &::placeholder {
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    font-weight: 500;
  }
`

export const LanguagePicker = styled(Select)`
  /* Select из темы рассчитан на форму (36px, на всю ширину). В строке
     мета соседние бейджи 26–30px, поэтому размер и ширина правятся здесь.
     Select принимает className и кладёт его на SelectWrapper, поэтому
     переопределениям нужна двойная специфичность. */
  && {
    width: auto;
  }

  && > button {
    min-height: 30px;
    padding: 0 ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
    font-size: 0.8125rem;
    font-weight: 600;
  }
`
