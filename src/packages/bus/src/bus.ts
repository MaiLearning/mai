import NanoEvents from 'nanoevents'
import type { BusEvents } from './events'

/** Фабрика эмиттера — для изоляции тестов (синглтон в тестах даёт cross-test загрязнение). */
export function createBus() {
  return new NanoEvents<BusEvents>()
}

/** Синглтон шины для приложения. */
export const bus = createBus()
