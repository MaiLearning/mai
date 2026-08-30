import { debug, info } from '@tauri-apps/plugin-log'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { CustomDifficulty } from '../core/types'
import { difficultyColor, difficultyTone, resolveDifficulty } from '../lib/difficulties'
import { Badge } from '../viewer.style'
import { DifficultyForm } from './DifficultyForm'
import { DifficultyMenu } from './DifficultyMenu'
import { Popover } from './Popover'

interface DifficultyPickerProps {
  value: string
  difficulties: CustomDifficulty[]
  onChange: (id: string) => void
  onChangeDifficulties: (next: CustomDifficulty[]) => void
}

/**
 * Редактор сложности задачи (режим edit): бейдж-триггер, меню выбора
 * (пресеты + свои) и форма создания/правки своей сложности.
 */
export function DifficultyPicker({
  value,
  difficulties,
  onChange,
  onChangeDifficulties,
}: DifficultyPickerProps) {
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<CustomDifficulty | null>(null)

  const view = resolveDifficulty(value, difficulties)
  const close = () => {
    setOpen(false)
    setCreating(false)
    setEditing(null)
  }

  const submitForm = (label: string, color: string) => {
    if (editing) {
      onChangeDifficulties(
        difficulties.map((d) => (d.id === editing.id ? { ...d, label, color } : d)),
      )
      debug(`Своя сложность ${editing.id} изменена`)
    } else {
      onChangeDifficulties([...difficulties, { id: crypto.randomUUID(), label, color }])
      info(`Создана своя сложность «${label}»`)
    }
    close()
  }

  /** Удаление своей сложности — из меню или из формы правки. */
  const deleteDifficulty = (id: string) => {
    const label = difficulties.find((d) => d.id === id)?.label
    onChangeDifficulties(difficulties.filter((d) => d.id !== id))
    info(`Своя сложность «${label ?? id}» удалена`)
  }

  return (
    <Popover
      open={open}
      onClose={close}
      anchor={
        <Badge
          as="button"
          type="button"
          $tone={difficultyTone(view) ?? 'default'}
          $color={difficultyColor(view)}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {view?.label ?? 'Без сложности'}
          <ChevronDown size={12} aria-hidden="true" />
        </Badge>
      }
    >
      {creating || editing ? (
        <DifficultyForm
          initial={editing ?? undefined}
          onSubmit={submitForm}
          onCancel={close}
          onDelete={
            editing
              ? () => {
                  deleteDifficulty(editing.id)
                  close()
                }
              : undefined
          }
        />
      ) : (
        <DifficultyMenu
          value={value}
          difficulties={difficulties}
          onSelect={(id) => {
            onChange(id)
            close()
          }}
          onEdit={setEditing}
          onDelete={(id) => deleteDifficulty(id)}
          onCreate={() => setCreating(true)}
        />
      )}
    </Popover>
  )
}
