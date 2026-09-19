import styled, { css } from 'styled-components'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.background.body};
`

export const SubLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text.muted};
  margin: 0 0 8px;
`

export const PresetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const Preset = styled.button<{ $from: string; $to: string; $active: boolean }>`
  width: 46px;
  height: 26px;
  padding: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: linear-gradient(120deg, ${({ $from }) => $from}, ${({ $to }) => $to});
  border: 2px solid transparent;
  cursor: pointer;
  outline-offset: 2px;
  transition:
    transform ${({ theme }) => theme.durations.fast},
    box-shadow ${({ theme }) => theme.durations.fast};

  &:hover {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      box-shadow:
        0 0 0 2px ${theme.background.surface},
        0 0 0 4px ${theme.border.accent};
    `}
`

export const SlotRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const Slot = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.border.accent : theme.border.default)};
  background: ${({ theme }) => theme.background.surface};
  text-align: left;
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.durations.fast},
    box-shadow ${({ theme }) => theme.durations.fast};

  ${({ $active, theme }) =>
    $active &&
    css`
      box-shadow: 0 0 0 3px ${theme.background.accentSubtle};
    `}
`

export const Bubble = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 9px;
  background: ${({ $color }) => $color};
  box-shadow: inset 0 0 0 1px rgba(22, 20, 40, 0.12);
`

export const SlotText = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;

  strong {
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text.primary};
  }

  code {
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    font-size: 11.5px;
    color: ${({ theme }) => theme.text.muted};
    text-transform: uppercase;
  }
`

export const Swap = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text.muted};
  cursor: pointer;
  transition:
    color ${({ theme }) => theme.durations.fast},
    border-color ${({ theme }) => theme.durations.fast};

  &:hover {
    color: ${({ theme }) => theme.text.accent};
    border-color: ${({ theme }) => theme.border.accent};
  }
`

export const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 6px;
`

export const Swatch = styled.button<{ $color: string; $selected: boolean }>`
  position: relative;
  aspect-ratio: 1;
  border: none;
  padding: 0;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  box-shadow: inset 0 0 0 1px rgba(22, 20, 40, 0.14);
  cursor: pointer;
  transition: transform ${({ theme }) => theme.durations.fast};

  &:hover {
    transform: scale(1.08);
  }

  svg {
    position: absolute;
    inset: 0;
    margin: auto;
    opacity: ${({ $selected }) => ($selected ? 1 : 0)};
  }
`

export const HexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const HexInput = styled.input`
  flex: 1;
  height: 38px;
  min-width: 0;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 13px;
  text-transform: uppercase;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.border.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.background.accentSubtle};
  }
`

export const PickerAnchor = styled.div`
  position: relative;
  display: inline-flex;
`

export const CustomButton = styled.button<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px dashed ${({ theme, $open }) => ($open ? theme.border.accent : theme.border.strong)};
  /* Без явного фона рисуется дефолтный светлый buttonface браузера */
  background: transparent;
  color: ${({ theme, $open }) => ($open ? theme.text.accent : theme.text.muted)};
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition:
    color ${({ theme }) => theme.durations.fast},
    border-color ${({ theme }) => theme.durations.fast};

  &:hover {
    color: ${({ theme }) => theme.text.accent};
    border-color: ${({ theme }) => theme.border.accent};
  }
`

/** Попап с пикером: раскрывается вверх от кнопки «Свой цвет». */
export const Popup = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  z-index: 20;
  width: 248px;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.elevated};
  box-shadow: ${({ theme }) => theme.shadows.md};
`
