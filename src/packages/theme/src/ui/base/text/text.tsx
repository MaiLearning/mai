import type { ComponentPropsWithoutRef, ElementType } from 'react'
import type { AppTheme } from '../../../base/theme'
import { StyledText } from './text.style'

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'
export type TextLineHeight = 'tight' | 'normal' | 'relaxed'
export type TextAlign = 'left' | 'center' | 'right' | 'justify'
export type TextColor = keyof AppTheme['text'] | keyof AppTheme['status'] | (string & {})

/** Пропсы текстового примитива Text. */
export interface TextProps {
  /**
   * Элемент, в который рендерится текст. Позволяет одним компонентом
   * покрыть все текстовые уровни: заголовки (h1..h6), абзады, подписи.
   * Принимает тег ('p') или компонент.
   * @default 'span'
   */
  as?: ElementType
  /** Размер шрифта. Маппится на токен typography.sizes. */
  size?: TextSize
  /** Насыщенность шрифта. Маппится на токен typography.weights. */
  weight?: TextWeight
  /**
   * Цвет текста: семантический токен темы (colors.*) или любой CSS-цвет.
   * @default 'primary'
   */
  color?: TextColor
  /** Межстрочный интервал. Маппится на токен typography.lineHeights. */
  lineHeight?: TextLineHeight
  /** Выравнивание текста. По умолчанию наследуется от родителя. */
  align?: TextAlign
  /**
   * Режим «одна строка с многоточием»: при нехватке места текст
   * обрезается по ширине контейнера и заканчивается многоточием.
   */
  ellipsis?: boolean
}

export type TextComponentProps = TextProps & ComponentPropsWithoutRef<'span'>

/**
 * Текстовый примитив дизайн-системы Mai: единственная точка стилизации
 * текста через токены темы (типографика, семантические цвета).
 * Через `as` закрывает заголовки и абзады без отдельных компонентов.
 *
 * @example
 * <Text as="h1" size="xl" weight="bold">Заголовок</Text>
 * <Text color="muted" size="sm">Подпись</Text>
 */
export function Text({
  as = 'span',
  size,
  weight,
  color,
  lineHeight,
  align,
  ellipsis,
  children,
  ...domProps
}: TextComponentProps) {
  return (
    <StyledText
      as={as}
      $size={size}
      $weight={weight}
      $color={color}
      $lineHeight={lineHeight}
      $align={align}
      $ellipsis={ellipsis}
      {...domProps}
    >
      {children}
    </StyledText>
  )
}
