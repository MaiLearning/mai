import type { ReactNode } from 'react'

export type HomeIconName =
  | 'arrow'
  | 'book'
  | 'clock'
  | 'compass'
  | 'flame'
  | 'layers'
  | 'pen'
  | 'plus'
  | 'spark'

const paths: Record<HomeIconName, ReactNode> = {
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  book: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Zm0 0V19" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  flame: (
    <path d="M12 21a6 6 0 0 0 5.5-6.1c0-3.4-2.2-5.8-4.3-8.4-.3 2.1-1.2 3.5-2.3 4.3-.2-2.6-1.3-4.7-3-6.8.1 3.3-3 5.6-3 9.1A6 6 0 0 0 12 21Z" />
  ),
  layers: (
    <>
      <path d="m12 3 8 4-8 4-8-4 8-4Z" />
      <path d="m4 12 8 4 8-4M4 17l8 4 8-4" />
    </>
  ),
  pen: (
    <>
      <path d="m4 20 4.2-1 9.7-9.7a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z" />
      <path d="m13.5 7.5 3 3" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  spark: <path d="m12 3 1.5 6.5L20 12l-6.5 1.5L12 20l-1.5-6.5L4 12l6.5-2.5L12 3Z" />,
}

export function HomeIcon({ name, size = 18 }: { name: HomeIconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}
