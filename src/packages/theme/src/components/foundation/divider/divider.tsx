import { DividerRoot } from './divider.style'

export interface DividerProps {
  /** Ориентация: вертикальный разделитель растягивается по высоте контейнера. */
  vertical?: boolean
  className?: string
}

/**
 * Разделитель между группами контента: тонкая линия в нейтральном цвете
 * границы темы. Горизонтальный по умолчанию, вертикальный — для рядов.
 */
export function Divider({ vertical = false, className }: DividerProps) {
  return (
    <DividerRoot
      $vertical={vertical}
      className={className}
      role="separator"
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
    />
  )
}
