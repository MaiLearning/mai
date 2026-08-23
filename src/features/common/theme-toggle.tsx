import { Moon, Sun } from 'lucide-react'
import styled from 'styled-components'
import { useAppTheme } from '@/app/theme/hooks'

export function ThemeToggle() {
  const { isDark, setTheme } = useAppTheme()

  return (
    <Toggle
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </Toggle>
  )
}

const Toggle = styled.button`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`
