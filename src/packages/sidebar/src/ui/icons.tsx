import {
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import type { ComponentProps } from 'react'

type LucideIconProps = ComponentProps<typeof ChevronRight>

/**
 * Иконки sidebar-а на базе lucide-react.
 * strokeWidth=1.5 для соответствия дизайн-макету, size — по контексту.
 */

export const ChevronIcon = (props: LucideIconProps) => (
  <ChevronRight size={12} strokeWidth={1.5} {...props} />
)
export const SearchIcon = (props: LucideIconProps) => (
  <Search size={14} strokeWidth={1.5} {...props} />
)
export const CloseIcon = (props: LucideIconProps) => <X size={12} strokeWidth={1.5} {...props} />
export const PlusIcon = (props: LucideIconProps) => <Plus size={16} strokeWidth={1.5} {...props} />
export const MoreIcon = (props: LucideIconProps) => (
  <MoreHorizontal size={16} strokeWidth={1.5} {...props} />
)
export const FolderIcon = (props: LucideIconProps) => (
  <Folder size={15} strokeWidth={1.5} {...props} />
)
export const FolderOpenIcon = (props: LucideIconProps) => (
  <FolderOpen size={15} strokeWidth={1.5} {...props} />
)
export const ResourceIcon = (props: LucideIconProps) => (
  <FileText size={15} strokeWidth={1.5} {...props} />
)
export const TrashIcon = (props: LucideIconProps) => (
  <Trash2 size={13} strokeWidth={1.5} {...props} />
)
