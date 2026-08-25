import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'

type SafeAreaInsets = { top: number; bottom: number; left: number; right: number }

const SafeAreaContext = createContext<SafeAreaInsets>({ top: 0, bottom: 0, left: 0, right: 0 })
export const useSafeArea = () => useContext(SafeAreaContext)

export function SafeAreaProvider({ children }: { children: ReactNode }) {
  const [insets, setInsets] = useState<SafeAreaInsets>(
    (window as any).__MAI_SYSTEM_INSETS__ ?? { top: 0, bottom: 0, left: 0, right: 0 },
  )
  useEffect(() => {
    const handleInsets = (event: Event) => {
      const detail = (event as CustomEvent<SafeAreaInsets>).detail
      if (detail) setInsets(detail)
    }
    window.addEventListener('mai:safe-area-insets', handleInsets)

    return () => window.removeEventListener('mai:safe-area-insets', handleInsets)
  }, [])

  return <SafeAreaContext.Provider value={insets}>{children}</SafeAreaContext.Provider>
}
