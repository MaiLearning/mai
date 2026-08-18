import { appConfig } from '@/app/config'

export const isFakeDataEnabled = appConfig.mode === 'development' && appConfig.fakeData
