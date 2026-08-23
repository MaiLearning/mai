import { Sparkles } from 'lucide-react'
import styled from 'styled-components'

interface LogoProps {
  showWordmark?: boolean
}

export function Logo({ showWordmark = true }: LogoProps) {
  return (
    <Root>
      <Mark>
        <Sparkles size={19} />
      </Mark>
      {showWordmark && <Wordmark>Mai</Wordmark>}
    </Root>
  )
}

const Root = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: nowrap;
`

const Mark = styled.span`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
`

const Wordmark = styled.span`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1;
`
