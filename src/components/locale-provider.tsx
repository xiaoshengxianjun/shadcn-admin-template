import { useMemo, useState, type ReactNode } from 'react'

import { LocaleContext } from '@/context/locale-context'
import { getMessage } from '@/i18n/messages'
import type { LocaleContextValue } from '@/context/locale-context'
import { type Locale } from '@/types/locale'

const STORAGE_KEY = 'admin-template-locale'
const DEFAULT_LOCALE: Locale = 'zh-CN'

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_LOCALE
    }
    const cachedLocale = window.localStorage.getItem(STORAGE_KEY) as Locale | null
    if (cachedLocale === 'zh-CN' || cachedLocale === 'en-US') {
      return cachedLocale
    }
    return DEFAULT_LOCALE
  })

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale)
    window.localStorage.setItem(STORAGE_KEY, nextLocale)
  }

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => getMessage(locale, key),
    }),
    [locale]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
