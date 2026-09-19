import styled from 'styled-components'

export const Header = styled.header<{ $from: string; $to: string; $ink: string }>`
  position: relative;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg}
    ${({ theme }) => theme.spacing.lg};
  color: ${({ $ink }) => $ink};
  background: linear-gradient(135deg, ${({ $from }) => $from} 0%, ${({ $to }) => $to} 100%);
  transition: background ${({ theme }) => theme.durations.normal};
  isolation: isolate;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: radial-gradient(120% 90% at 88% -20%, rgba(255, 255, 255, 0.32), transparent 60%);
    pointer-events: none;
  }

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md} 28px ${({ theme }) => theme.spacing.lg};
  }
`

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: 28px;
`

export const Eyebrow = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.72;
`

export const Title = styled.h2<{ $placeholder: boolean }>`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
  opacity: ${({ $placeholder }) => ($placeholder ? 0.5 : 1)};
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: ${({ theme }) => theme.spacing.md};
`

export const Chip = styled.span<{ $ink: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $ink }) => ($ink === '#ffffff' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(22, 20, 40, 0.18)')};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  backdrop-filter: blur(4px);
`

export const Dot = styled.span<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $color }) => $color};
  box-shadow: 0 0 0 2px currentColor;
  opacity: 0.9;
`

export const CloseButton = styled.button<{ $onGradient: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.durations.fast},
    color ${({ theme }) => theme.durations.fast};

  ${({ theme, $onGradient }) =>
    $onGradient
      ? `
        color: rgba(255, 255, 255, 0.85);
        background: rgba(255, 255, 255, 0.16);
        backdrop-filter: blur(6px);

        &:hover {
          background: rgba(255, 255, 255, 0.3);
          color: #fff;
        }
      `
      : `
        color: ${theme.text.muted};
        background: transparent;

        &:hover {
          background: ${theme.background.accentSubtle};
          color: ${theme.text.primary};
        }
      `}
`
