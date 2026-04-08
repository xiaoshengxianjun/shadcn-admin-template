import { createContext } from 'react'

import type { MessageKey } from '@/i18n/messages'
import type { Locale } from '@/types/locale'

export type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey) => string
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)
