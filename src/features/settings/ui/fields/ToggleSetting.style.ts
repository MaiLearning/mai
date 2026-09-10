import styled from 'styled-components'

export const Switch = styled.button<{ $checked: boolean; $disabled?: boolean }>`
  position: relative;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme, $checked }) => ($checked ? theme.colors.primary : theme.colors.border)};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focus};
  }
`

export const Knob = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.textOnPrimary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transform: translateX(${({ $checked }) => ($checked ? '18px' : '0')});
  transition: transform ${({ theme }) => theme.transitions.fast};
`
