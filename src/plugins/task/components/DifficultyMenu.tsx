import { Check, Pencil, Plus, Trash2 } from 'lucide-react'
import { useTheme } from 'styled-components'
import type { CustomDifficulty } from '../core/types'
import { DIFFICULTY_PRESETS, type DifficultyTone } from '../lib/difficulties'
import { ActionButton, MenuRow, RowActions, RowButton } from './DifficultyPicker.style'
import { ColorDot, MenuDivider, MenuItem } from './Popover.style'

interface DifficultyMenuProps {
  value: string
  difficulties: CustomDifficulty[]
  onSelect: (id: string) => void
  onEdit: (difficulty: CustomDifficulty) => void
  onDelete: (id: string) => void
  onCreate: () => void
}

/** Содержимое меню сложности: пресеты, свои с действиями, «Новая сложность». */
export function DifficultyMenu({
  value,
  difficulties,
  onSelect,
  onEdit,
  onDelete,
  onCreate,
}: DifficultyMenuProps) {
  const theme = useTheme()
  const toneColor: Record<DifficultyTone, string> = {
    easy: theme.colors.success,
    medium: theme.colors.accent,
    hard: theme.colors.danger,
  }

  return (
    <>
      {DIFFICULTY_PRESETS.map((preset) => (
        <MenuItem
          key={preset.id}
          type="button"
          role="menuitemradio"
          aria-checked={value === preset.id}
          onClick={() => onSelect(preset.id)}
        >
          <ColorDot $bg={toneColor[preset.id]} />
          {preset.label}
          {value === preset.id && (
            <Check size={14} style={{ marginLeft: 'auto' }} aria-hidden="true" />
          )}
        </MenuItem>
      ))}

      {difficulties.map((difficulty) => (
        <MenuRow key={difficulty.id} $active={value === difficulty.id}>
          <RowButton
            type="button"
            role="menuitemradio"
            aria-checked={value === difficulty.id}
            onClick={() => onSelect(difficulty.id)}
          >
            <ColorDot $bg={difficulty.color} />
            {difficulty.label}
            {value === difficulty.id && (
              <Check size={14} style={{ marginLeft: 'auto' }} aria-hidden="true" />
            )}
          </RowButton>
          <RowActions>
            <ActionButton
              type="button"
              aria-label={`Изменить сложность «${difficulty.label}»`}
              onClick={() => onEdit(difficulty)}
            >
              <Pencil size={13} />
            </ActionButton>
            <ActionButton
              type="button"
              $danger
              aria-label={`Удалить сложность «${difficulty.label}»`}
              onClick={() => onDelete(difficulty.id)}
            >
              <Trash2 size={13} />
            </ActionButton>
          </RowActions>
        </MenuRow>
      ))}

      <MenuDivider />
      <MenuItem type="button" onClick={onCreate}>
        <Plus size={14} />
        Новая сложность
      </MenuItem>
    </>
  )
}
