import type { InputHTMLAttributes } from 'react'
import styled from 'styled-components'

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
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`
const LabelText = styled.span`
  color: ${({ theme }) => theme.colors.text};
`
const Root = styled.input`
  display: block;
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;
  transition: border-color 0.16s ease, box-shadow 0.16s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySurface};
    outline: none;
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`
const Error = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`
