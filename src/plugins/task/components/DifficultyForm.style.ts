import styled from 'styled-components'

/** Корень формы своей сложности внутри панели меню. */
export const FormRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 252px;
  padding: 6px;
`

export const FormInput = styled.input`
  height: 36px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  font-size: 0.875rem;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySurface};
  }
`

export const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 5px;
`

export const Swatch = styled.button<{ $color: string; $selected: boolean }>`
  position: relative;
  aspect-ratio: 1;
  padding: 0;
  border: none;
  border-radius: 7px;
  background: ${({ $color }) => $color};
  box-shadow: inset 0 0 0 1px rgba(22, 20, 40, 0.14);
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.08);
  }

  svg {
    position: absolute;
    inset: 0;
    margin: auto;
  }
`

/** Якорь кнопки «Свой цвет» и попапа ColorPicker. */
export const PickerAnchor = styled.div`
  position: relative;
  display: inline-flex;
`

export const CustomButton = styled.button<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  border: 1px dashed
    ${({ theme, $open }) => ($open ? theme.colors.primary : theme.colors.borderStrong)};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme, $open }) => ($open ? theme.colors.primary : theme.colors.textMuted)};
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  transition:
    color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

/** Попап с ColorPicker: раскрывается над панелью меню. */
export const Popup = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  z-index: 30;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

export const FormFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

export const Actions = styled.div`
  display: flex;
  gap: 6px;
`

export const CancelButton = styled.button`
  height: 30px;
  padding: 0 10px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
  font-weight: 600;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

export const SaveButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  font-size: 0.75rem;
  font-weight: 600;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`
