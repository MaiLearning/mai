import { TASK_KIND_LABEL, type TaskKind } from '../core/types'
import { MenuItem } from './Popover.style'

interface KindMenuProps {
  onSelect: (kind: TaskKind) => void
}

const KINDS = Object.keys(TASK_KIND_LABEL) as TaskKind[]

/** Список типов задач для создания новой. */
export function KindMenu({ onSelect }: KindMenuProps) {
  return (
    <>
      {KINDS.map((kind) => (
        <MenuItem key={kind} type="button" role="menuitem" onClick={() => onSelect(kind)}>
          {TASK_KIND_LABEL[kind]}
        </MenuItem>
      ))}
    </>
  )
}
