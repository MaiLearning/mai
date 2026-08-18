import type { InputHTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
}
export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <Label>
      <input type="checkbox" {...props} />
      {label}
    </Label>
  )
}
const Label = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`
