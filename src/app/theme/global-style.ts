import { createGlobalStyle } from 'styled-components'
import { fontFaces } from './fonts'

export const GlobalStyle = createGlobalStyle`
  ${fontFaces}

  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { width: 100%; min-width: 0; min-height: 100%; margin: 0; }
  html { overflow-x: hidden; }

  body {
    background: ${({ theme }) => theme.colors.body};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.font.body};
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.font.display};
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin: 0;
  }

  a { color: inherit; text-decoration: none; }
  button { font-family: inherit; cursor: pointer; }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.primarySurface};
  }
`
