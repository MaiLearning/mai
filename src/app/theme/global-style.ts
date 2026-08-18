import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { width: 100%; min-width: 0; min-height: 100%; margin: 0; }
  html { overflow-x: hidden; }
  body { background: ${({ theme }) => theme.colors.body}; color: ${({ theme }) => theme.colors.text}; font-family: Inter, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  h1, h2, h3, h4, h5, h6, p { margin: 0; }
  button, input, textarea { font: inherit; }
  button { cursor: pointer; }
`
