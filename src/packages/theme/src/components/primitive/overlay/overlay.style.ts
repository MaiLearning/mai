import { keyframes } from 'styled-components'

/** Появление/затухание подложки модальных панелей (Modal, Drawer). */
export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

/** Длительность анимации закрытия — совпадает с таймером `useOverlayPanel`. */
export const CLOSE_DURATION_MS = 180
