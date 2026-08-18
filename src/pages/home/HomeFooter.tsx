import { Brand, FooterInner, FooterRoot, Mark } from './footer.styles'
import { HomeIcon } from './HomeIcon'

export function HomeFooter() {
  return (
    <FooterRoot>
      <FooterInner>
        <Brand to="/home">
          <Mark>
            <HomeIcon name="spark" size={18} />
          </Mark>
          Mai
        </Brand>
        <span>© {new Date().getFullYear()} Mai. Build your own course, then learn it.</span>
      </FooterInner>
    </FooterRoot>
  )
}
