import { Divider } from '@mai/theme'
import styled from 'styled-components'

export const SectionDivider = styled(Divider)`
  /* Компенсируем gap ModalBody (xl = 24px): между статусом и опасной зоной нужно ~16px */
  margin: -8px 0;
`
