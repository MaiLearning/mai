import styled from 'styled-components'

export interface ScrollAreaRootProps {
  $height?: string
  $maxHeight?: string
}

export const ScrollAreaRoot = styled.div<ScrollAreaRootProps>`
  overflow: auto;
  height: ${({ $height }) => $height ?? 'auto'};
  max-height: ${({ $maxHeight }) => $maxHeight ?? 'none'};

  scrollbar-width: thin;
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
