import { css, styled } from 'styled-components'

export interface ScrollAreaRootProps {
  $height?: string
  $maxHeight?: string
}

/**
 * Тематический скроллбар фонда: тонкая полоса в цвет токена границы.
 * Единый источник стиля скроллбара — переиспользуется полями, списками
 * и всеми зонами прокрутки приложения.
 *
 * Подмешивается в `styled`-блок, который сам управляет `overflow`
 * (не в `ScrollArea`): для зон, у которых своя геометрия и своя ось
 * прокрутки, — скролл-зоны viewer-плагинов, панели, меню подсказок.
 *
 * `scrollbar-gutter: stable` резервирует место под полосу заранее, чтобы
 * содержимое не прыгало вправо, когда полоса появляется и исчезает.
 */
export const themedScrollbar = css`
  scrollbar-width: thin;
  scrollbar-gutter: stable;
  scrollbar-color: ${({ theme }) => theme.utils.getBorder('neutral', 'default')} transparent;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
    border-radius: ${({ theme }) => theme.radius.full};

    &:hover {
      background: ${({ theme }) =>
        theme.utils.withState(theme.utils.getBorder('neutral', 'default'), 'hoverAlpha')};
    }
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`

export const ScrollAreaRoot = styled.div<ScrollAreaRootProps>`
  overflow: auto;
  height: ${({ $height }) => $height ?? 'auto'};
  max-height: ${({ $maxHeight }) => $maxHeight ?? 'none'};

  ${themedScrollbar}
`
