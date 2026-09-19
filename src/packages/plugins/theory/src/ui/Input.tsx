import type { InputHTMLAttributes } from 'react'
import styled from 'styled-components'

// Поле ввода с подписью и текстом ошибки
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}
export function Input({ label, error, ...props }: InputProps) {
  return (
    <Label>
      {label && <LabelText>{label}</LabelText>}
      <Root aria-invalid={Boolean(error)} {...props} />
      {error && <Error>{error}</Error>}
    </Label>
  )
}
const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`
const LabelText = styled.span`
  color: ${({ theme }) => theme.text.primary};
`
const Root = styled.input`
  display: block;
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.background.body};
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  transition: border-color 0.16s ease, box-shadow 0.16s ease;

  &:focus {
    border-color: ${({ theme }) => theme.border.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.background.accentSubtle};
    outline: none;
  }
  &::placeholder {
    color: ${({ theme }) => theme.text.muted};
  }
`
const Error = styled.span`
  display: block;
  color: ${({ theme }) => theme.status.danger.foreground};
  font-size: 13px;
`
