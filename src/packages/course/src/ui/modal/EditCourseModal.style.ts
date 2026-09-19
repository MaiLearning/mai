import styled from 'styled-components'

export const SectionDivider = styled.hr`
  height: 1px;
  /* Компенсируем gap ModalBody (xl = 24px): между статусом и опасной зоной нужно ~16px */
  margin: -8px 0;
  border: none;
  background: ${({ theme }) => theme.border.default};
`
