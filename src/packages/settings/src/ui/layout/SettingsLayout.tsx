import type { ReactNode } from 'react'
import styles from './SettingsLayout.module.css'

export interface SettingsLayoutProps {
  /** Навигация по разделам настроек. */
  nav: ReactNode
  /** Содержимое выбранного пункта. */
  children: ReactNode
}

/** Каркас страницы настроек: навигация слева, содержимое справа. */
export function SettingsLayout({ nav, children }: SettingsLayoutProps) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>{nav}</aside>
      <main className={styles.content}>{children}</main>
    </div>
  )
}
