declare module 'nanoevents' {
  export type Unbind = () => void

  export default class NanoEvents<Events extends Record<keyof Events, (...args: any[]) => void>> {
    events: { [K in keyof Events]?: Events[K][] }
    on<K extends keyof Events>(event: K, cb: Events[K]): Unbind
    emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): void
  }
}
