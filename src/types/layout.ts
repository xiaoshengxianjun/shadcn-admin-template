import type { MessageKey } from '@/i18n/messages'

export type LayoutMode = 'leftSidebar' | 'topNav' | 'mixed'

export const LAYOUT_MODE_STORAGE_KEY = 'admin-layout-mode'

export const LAYOUT_OPTIONS = [
  {
    value: 'leftSidebar',
    icon: 'PanelLeft',
    labelKey: 'layoutLeftSidebar',
  },
  {
    value: 'topNav',
    icon: 'Rows3',
    labelKey: 'layoutTopNav',
  },
  {
    value: 'mixed',
    icon: 'PanelsTopLeft',
    labelKey: 'layoutMixed',
  },
] as const satisfies ReadonlyArray<{
  value: LayoutMode
  icon: 'PanelLeft' | 'Rows3' | 'PanelsTopLeft'
  labelKey: MessageKey
}>
