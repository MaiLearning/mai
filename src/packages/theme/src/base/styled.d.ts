import 'styled-components'
import type { AppTheme } from './theme'

declare module 'styled-components' {
  interface DefaultTheme extends AppTheme {}
}
