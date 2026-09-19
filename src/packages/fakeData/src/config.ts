export type FakeDataMode = 'development' | 'production' | 'release'

export interface FakeDataConfig {
  mode: FakeDataMode
  fakeData: boolean
}

// До явной конфигурации fake-режим выключен.
let config: FakeDataConfig = { mode: 'production', fakeData: false }

/**
 * Включает/выключает fake-режим. Вызывается один раз на старте приложения
 * с данными appConfig (virtual:mai-config): fake-данные доступны только
 * в development и только при fakeData=true.
 */
export function configureFakeData(next: FakeDataConfig): void {
  config = next
}

export function isFakeDataEnabled(): boolean {
  return config.mode === 'development' && config.fakeData
}
