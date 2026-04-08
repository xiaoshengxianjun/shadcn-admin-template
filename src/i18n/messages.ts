import type { Locale } from '@/types/locale'
import { enUSMessages } from '@/i18n/locales/en-US'
import { zhCNMessages } from '@/i18n/locales/zh-CN'

export const messages = {
  'zh-CN': zhCNMessages,
  'en-US': enUSMessages,
} as const

export type MessageKey = keyof (typeof messages)['zh-CN']

export function getMessage(locale: Locale, key: MessageKey): string {
  return messages[locale][key]
}
