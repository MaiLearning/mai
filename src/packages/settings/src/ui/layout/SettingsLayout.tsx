import type { ReactNode } from 'react'
import { Content, Layout, Sidebar } from './SettingsLayout.style'

export interface SettingsLayoutProps {
  /** Навигация по разделам настроек. */
  nav: ReactNode
  /** Содержимое выбранного пункта. */
  children: ReactNode
}

/** Каркас страницы настроек: навигация слева, содержимое справа. */
export function SettingsLayout({ nav, children }: SettingsLayoutProps) {
  return (
    <Layout>
      <Sidebar>{nav}</Sidebar>
      <Content>{children}</Content>
    </Layout>
  )
}
