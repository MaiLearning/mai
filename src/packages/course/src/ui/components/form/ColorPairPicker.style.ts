import styled, { css } from 'styled-components'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'body')};
`

export const SubLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
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
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      box-shadow:
        0 0 0 2px ${theme.utils.getBackground('neutral', 'body')},
        0 0 0 4px ${theme.utils.getBorder('accent', 'default')};
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
    ${({ theme, $active }) =>
      $active
        ? theme.utils.getBorder('accent', 'default')
        : theme.utils.getBorder('neutral', 'default')};
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.durations.fast},
    box-shadow ${({ theme }) => theme.durations.fast};

  ${({ $active, theme }) =>
    $active &&
    css`
      box-shadow: 0 0 0 3px ${theme.utils.getBackground('accent', 'surface')};
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
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
`

export const SlotText = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;

  strong {
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }

  code {
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    font-size: 11.5px;
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
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
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: transparent;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  cursor: pointer;
  transition:
    color ${({ theme }) => theme.durations.fast},
    border-color ${({ theme }) => theme.durations.fast};

  &:hover {
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
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
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
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
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'body')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 13px;
  text-transform: uppercase;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
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
  border: 1px dashed
    ${({ theme, $open }) =>
      $open
        ? theme.utils.getBorder('accent', 'default')
        : theme.utils.getBorder('neutral', 'strong')};
  /* Без явного фона рисуется дефолтный светлый buttonface браузера */
  background: transparent;
  color: ${({ theme, $open }) =>
    $open ? theme.utils.getText('accent', 'primary') : theme.utils.getText('neutral', 'muted')};
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition:
    color ${({ theme }) => theme.durations.fast},
    border-color ${({ theme }) => theme.durations.fast};

  &:hover {
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
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
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
  box-shadow: ${({ theme }) => theme.shadows.md};
`
