import type { InputHTMLAttributes } from 'react'
import styled from 'styled-components'
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}
export function Input({ label, error, ...props }: InputProps) {
  return (
    <label>
      {label}
      <Root aria-invalid={Boolean(error)} {...props} />
      {error && <Error>{error}</Error>}
    </label>
  )
}
const Root = styled.input`
  display: block;
  width: 100%;
  margin-top: 6px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`
const Error = styled.span`
  display: block;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
`
