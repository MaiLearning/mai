import { styled } from 'styled-components'

export const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  & > input {
    padding-right: 34px;
  }

  & > button {
    position: absolute;
    right: ${({ theme }) => theme.spacing.sm};
  }
`
