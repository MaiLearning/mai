import type { InputHTMLAttributes } from 'react'
import { Error, Label, LabelText, Root } from './Input.style'

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
