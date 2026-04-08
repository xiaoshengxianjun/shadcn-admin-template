import type { MessageKey } from '@/i18n/messages'

export type RouteLayout = 'dashboard' | 'blank'

export type RouteIconName = 'LayoutDashboard' | 'Users' | 'ShieldCheck' | 'Settings'

export type PageRouteMeta = {
  path: string
  titleKey: MessageKey
  layout: RouteLayout
  inMenu?: boolean
  order?: number
  icon?: RouteIconName
}
