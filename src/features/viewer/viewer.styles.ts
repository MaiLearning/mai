import styled from 'styled-components'
import { Button } from '@/app/theme/components/Button'
import { Text } from '@/app/theme/components/Text'

export const Center = styled.div`
  display: flex;
  justify-content: center;
  padding: 32px;
`

export const MessageBlock = styled.div`
  padding: 32px;
  text-align: center;

  span {
    display: block;
    margin-bottom: 8px;
  }
`

export const PickerRoot = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 32px;
`

export const Title = styled(Text)`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
`

export const Hint = styled(Text)`
  display: block;
  margin-bottom: 16px;
`

export const TypeButton = styled(Button)`
  display: block;
  width: 100%;
  margin-bottom: 8px;
  text-align: left;
`
