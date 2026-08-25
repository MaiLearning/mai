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
import type { SVGProps } from 'react'

/**
 * Иконки sidebar-а на базе lucide-react.
 * strokeWidth=1.5 для соответствия дизайн-макету, size — по контексту.
 */

export const ChevronIcon = (props: SVGProps<SVGSVGElement>) => (
  <ChevronRight size={12} strokeWidth={1.5} {...props} />
)
export const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <Search size={14} strokeWidth={1.5} {...props} />
)
export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <X size={12} strokeWidth={1.5} {...props} />
)
export const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <Plus size={16} strokeWidth={1.5} {...props} />
)
export const MoreIcon = (props: SVGProps<SVGSVGElement>) => (
  <MoreHorizontal size={16} strokeWidth={1.5} {...props} />
)
export const FolderIcon = (props: SVGProps<SVGSVGElement>) => (
  <Folder size={15} strokeWidth={1.5} {...props} />
)
export const FolderOpenIcon = (props: SVGProps<SVGSVGElement>) => (
  <FolderOpen size={15} strokeWidth={1.5} {...props} />
)
export const ResourceIcon = (props: SVGProps<SVGSVGElement>) => (
  <FileText size={15} strokeWidth={1.5} {...props} />
)
export const TrashIcon = (props: SVGProps<SVGSVGElement>) => (
  <Trash2 size={13} strokeWidth={1.5} {...props} />
)
