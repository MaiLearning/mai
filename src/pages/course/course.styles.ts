import styled from 'styled-components'

export const Shell = styled.div`
  display: grid;
  min-height: 100vh;
  grid-template-columns: 1fr;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 340px 1fr;
  }
`
export const Main = styled.main`
  min-width: 0;
  background: ${({ theme }) => theme.colors.body};
`
export const Sidebar = styled.aside<{ $open: boolean }>`
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 20;
  width: min(88vw, 340px);
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
  transition: transform 0.25s ease;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: sticky;
    top: 0;
    height: 100vh;
    transform: none;
  }
`
export const Overlay = styled.button<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 19;
  border: 0;
  background: ${({ theme }) => theme.colors.overlay};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`
export const SideHeader = styled.div`
  display: grid;
  gap: 16px;
  padding: 22px 20px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`
export const SideTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`
export const CloseButton = styled.button`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`
export const CourseTitle = styled.h2`
  font-size: 16px;
  text-wrap: balance;
`
export const ProgressBox = styled.div`
  display: grid;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 600;
  .row {
    display: flex;
    justify-content: space-between;
    font-variant-numeric: tabular-nums;
  }
`
export const Scroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 10px 28px;
`
export const TreeList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`
export const TreeRow = styled.button<{
  $depth: number
  $selected: boolean
  $folder: boolean
  $done: boolean
}>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 8px 10px 8px ${({ $depth }) => 10 + $depth * 16}px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme, $selected }) => ($selected ? theme.colors.primarySurface : 'transparent')};
  color: ${({ theme, $selected, $folder, $done }) => ($selected ? theme.colors.primary : $folder ? theme.colors.text : $done ? theme.colors.textMuted : theme.colors.text)};
  font: ${({ theme, $folder }) => ($folder ? `600 13.5px ${theme.font.display}` : `500 13.5px ${theme.font.body}`)};
  text-align: left;
  cursor: pointer;
  transition:
    background 0.16s ease,
    color 0.16s ease;
  &:hover {
    background: ${({ theme, $selected }) => ($selected ? theme.colors.primarySurface : theme.colors.body)};
  }
  .title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .duration {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 11px;
    white-space: nowrap;
  }
`
export const MobileBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.body}dd;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`
export const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 8px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  cursor: pointer;
`
export const Article = styled.article`
  max-width: 760px;
  margin: 0 auto;
  padding: 28px 20px 96px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 52px 40px 120px;
  }
`
export const Kicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`
export const Badge = styled.span<{
  $tone?: 'primary' | 'neutral' | 'success'
}>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme, $tone }) => ($tone === 'primary' ? theme.colors.primarySurface : $tone === 'success' ? theme.colors.successSurface : theme.colors.surface)};
  color: ${({ theme, $tone }) => ($tone === 'primary' ? theme.colors.primary : $tone === 'success' ? theme.colors.success : theme.colors.textMuted)};
  font-size: 12px;
  font-weight: 600;
`
export const Title = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.7rem);
  text-wrap: balance;
`
export const Lead = styled.p`
  margin: 14px 0 28px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 18px;
  text-wrap: pretty;
`
export const Media = styled.div<{
  $type: string
}>`
  display: grid;
  place-items: center;
  aspect-ratio: 16/9;
  margin-bottom: 32px;
  border-radius: ${({ theme }) => theme.radii.lg};
  color: #fff;
  background: ${({ $type }) => ($type === 'video' ? 'linear-gradient(135deg,#171528,#3a2f7a)' : $type === 'quiz' ? 'linear-gradient(135deg,#f5a524,#fbbf24)' : $type === 'exercise' ? 'linear-gradient(135deg,#1eae6f,#4ade80)' : 'linear-gradient(135deg,#6a54ff,#9d7bff)')};
  box-shadow: ${({ theme }) => theme.shadows.md};
`
export const PlayCircle = styled.div`
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border: 1px solid #ffffff66;
  border-radius: 50%;
  background: #ffffff2e;
  backdrop-filter: blur(4px);
`
export const Prose = styled.div`
  font-size: 16.5px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.text};
  h2 {
    margin: 36px 0 12px;
    font-size: 1.5rem;
  }
  p {
    margin: 0 0 18px;
  }
  ul {
    margin: 0 0 18px;
    padding-left: 22px;
  }
  li {
    margin-bottom: 8px;
  }
  code {
    padding: 2px 7px;
    border-radius: 6px;
    background: ${({ theme }) => theme.colors.primarySurface};
    color: ${({ theme }) => theme.colors.primary};
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    font-size: 0.88em;
  }
`
export const Callout = styled.div`
  margin: 8px 0 28px;
  padding: 16px 18px;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`
export const NavBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`
