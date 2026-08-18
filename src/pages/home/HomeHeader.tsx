import { Link } from 'react-router-dom'
import { HomeIcon } from './HomeIcon'
import {
  ActionLink,
  Actions,
  Brand,
  HeaderContainer,
  HeaderRoot,
  Mark,
  NavLinks,
} from './header.styles'

export function HomeHeader() {
  return (
    <HeaderRoot>
      <HeaderContainer>
        <Brand to="/home">
          <Mark>
            <HomeIcon name="spark" size={18} />
          </Mark>
          Mai
        </Brand>
        <NavLinks aria-label="Основная навигация">
          <Link to="/home">My courses</Link>
          <Link to="/course">Continue</Link>
          <Link to="#how-it-works">How it works</Link>
        </NavLinks>
        <Actions>
          <ActionLink to="/course" $variant="ghost">
            Sign in
          </ActionLink>
          <ActionLink to="/course">
            <HomeIcon name="plus" size={16} />
            New course
          </ActionLink>
        </Actions>
      </HeaderContainer>
    </HeaderRoot>
  )
}
