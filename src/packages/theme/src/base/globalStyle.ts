import { createGlobalStyle } from 'styled-components'

/**
 * Глобальные стили приложения. Сейчас пусты — точка подключения: как только
 * появятся базовые стили (body, шрифты, reset), они лягут сюда.
 * Рендерится внутри ThemeProvider, поэтому имеет доступ к токенам темы.
 */
export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: ${({ theme }) => theme.background.body};
    color: ${({ theme }) => theme.text.primary};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    -webkit-font-smoothing: antialiased;
  }
`
