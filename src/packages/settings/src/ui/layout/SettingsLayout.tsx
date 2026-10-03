import type { ReactNode } from 'react'
import { Content, Layout, Root, Sidebar } from './SettingsLayout.style'

export interface SettingsLayoutProps {
  /** Навигация по разделам настроек. */
  nav: ReactNode
  /** Содержимое выбранного пункта. */
  children: ReactNode
  /**
   * Ширина колонки навигации на широкой раскладке — готовое CSS-значение.
   * Каркас его не интерпретирует: решение о габаритах принимает страница,
   * потребитель не обязан ничего знать про раскладку.
   */
  navWidth?: string
}

/**
 * Каркас страницы настроек: навигация слева, содержимое справа.
 *
 * Навигация занимает всю высоту, а не «плавающую» панель; порог раскладки —
 * контейнерный запрос от корня, поэтому каркас верно ведёт себя и внутри
 * узкой колонки.
 */
export function SettingsLayout({ nav, children, navWidth = '17.5rem' }: SettingsLayoutProps) {
  return (
    <Root>
      <Layout>
        <Sidebar $navWidth={navWidth}>{nav}</Sidebar>
        <Content>{children}</Content>
      </Layout>
    </Root>
  )
}
