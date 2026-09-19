import styled from 'styled-components'

/** Корень формы своей сложности внутри панели меню. */
export const FormRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-width: 240px;
  padding: 6px;
`

export const FormInput = styled.input`
  height: 36px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text.primary};
  font: inherit;
  font-size: 0.875rem;

  &::placeholder {
    color: ${({ theme }) => theme.text.muted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.border.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.background.accentSubtle};
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
  transition: transform ${({ theme }) => theme.durations.fast};

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
  flex: 1;
  min-width: 0;
`

export const CustomButton = styled.button<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  border: 1px dashed ${({ theme, $open }) => ($open ? theme.border.accent : theme.border.strong)};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme, $open }) => ($open ? theme.text.accent : theme.text.muted)};
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  transition:
    color ${({ theme }) => theme.durations.fast},
    border-color ${({ theme }) => theme.durations.fast};

  &:hover {
    color: ${({ theme }) => theme.text.accent};
    border-color: ${({ theme }) => theme.border.accent};
  }
`

/** Попап с ColorPicker: раскрывается над панелью меню. */
export const Popup = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  z-index: 30;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.elevated};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

export const FormFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

/** Иконки-действия формы справа: отменить/удалить и сохранить/создать. */
export const FormIcon = styled.button<{ $danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.text.muted};
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover:not(:disabled) {
    color: ${({ theme, $danger }) => ($danger ? theme.status.danger.foreground : theme.text.accent)};
    background: ${({ theme, $danger }) =>
      $danger ? theme.status.danger.background : theme.background.accentSubtle};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`
