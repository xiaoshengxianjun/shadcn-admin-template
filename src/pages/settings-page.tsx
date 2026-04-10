import type { FC } from 'react'
import { LayoutPanelLeft, PanelsTopLeft, Rows3 } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLayoutMode } from '@/hooks/use-layout-mode'
import { useLocale } from '@/hooks/use-locale'
import { cn } from '@/lib/utils'
import type { LayoutMode } from '@/types/layout'
import { LAYOUT_OPTIONS } from '@/types/layout'
import { LOCALE_OPTIONS, type Locale } from '@/types/locale'
import type { ThemeName } from '@/types/theme'
import { THEME_OPTIONS } from '@/types/theme'
import type { PageRouteMeta } from '@/types/route'

type PageComponent = FC & { routeMeta: PageRouteMeta }

const SettingsPage: PageComponent = () => {
  const { locale, setLocale, t } = useLocale()
  const { theme, setTheme } = useTheme()
  const { layoutMode, setLayoutMode } = useLayoutMode()

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('menuSettings')}</CardTitle>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{t('settingsPageDescription')}</p>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('language')}</CardTitle>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{t('settingsLanguageDescription')}</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {LOCALE_OPTIONS.map((item) => {
              const active = locale === item.value
              return (
                <Button
                  key={item.value}
                  type="button"
                  variant={active ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => setLocale(item.value as Locale)}
                >
                  {item.label}
                </Button>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('theme')}</CardTitle>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{t('settingsThemeDescription')}</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2 xl:grid-cols-2">
            {THEME_OPTIONS.map((item) => {
              const active = theme === item.value
              return (
                <Button
                  key={item.value}
                  type="button"
                  variant="outline"
                  className={cn(
                    'h-11 justify-start border font-medium',
                    themeSwatchTextClassMap[item.value],
                    active ? 'ring-2 ring-[hsl(var(--primary))] ring-offset-1' : ''
                  )}
                  style={{ backgroundColor: item.previewColor }}
                  onClick={() => setTheme(item.value as ThemeName)}
                >
                  {locale === 'zh-CN' ? item.labelZh : item.labelEn}
                </Button>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t('layout')}</CardTitle>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{t('settingsLayoutDescription')}</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2 xl:grid-cols-3">
            {LAYOUT_OPTIONS.map((item) => {
              const active = item.value === layoutMode
              const ItemIcon = layoutIconMap[item.value]
              return (
                <Button
                  key={item.value}
                  type="button"
                  variant="outline"
                  className={cn(
                    'h-auto justify-start gap-3 p-2 text-left',
                    active ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)]' : ''
                  )}
                  onClick={() => setLayoutMode(item.value)}
                >
                  <LayoutPreview mode={item.value} active={active} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <ItemIcon
                        className={cn(
                          'h-3.5 w-3.5',
                          active ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'
                        )}
                      />
                      <span className="truncate text-xs font-medium text-[hsl(var(--foreground))]">
                        {t(item.labelKey)}
                      </span>
                    </div>
                    <p className="mt-0.5 break-words text-[11px] leading-4 text-[hsl(var(--muted-foreground))]">
                      {t(layoutDescKeyMap[item.value])}
                    </p>
                  </div>
                </Button>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-[hsl(var(--muted-foreground))]">{t('settingsImmediateEffect')}</p>
    </div>
  )
}

const layoutIconMap = {
  leftSidebar: LayoutPanelLeft,
  topNav: Rows3,
  mixed: PanelsTopLeft,
} as const

const layoutDescKeyMap = {
  leftSidebar: 'layoutDescLeftSidebar',
  topNav: 'layoutDescTopNav',
  mixed: 'layoutDescMixed',
} as const

const themeSwatchTextClassMap: Record<ThemeName, string> = {
  // 按色块亮度固定前景色：浅底深字，深底浅字，避免深色主题下变量色导致低对比。
  light: 'text-slate-900 hover:text-slate-900',
  dark: 'text-slate-100 hover:text-slate-100',
  'deep-violet': 'text-slate-100 hover:text-slate-100',
  'deep-green': 'text-slate-100 hover:text-slate-100',
  'peach-light': 'text-slate-900 hover:text-slate-900',
  'warm-yellow': 'text-slate-900 hover:text-slate-900',
}

function LayoutPreview({ mode, active }: { mode: LayoutMode; active: boolean }) {
  if (mode === 'leftSidebar') {
    return (
      <div
        className={cn(
          'flex h-10 w-16 overflow-hidden rounded border',
          active ? 'border-[hsl(var(--primary)/0.45)]' : 'border-[hsl(var(--border))]'
        )}
      >
        <div className="w-4 bg-[hsl(var(--muted))]" />
        <div className="flex-1 bg-[hsl(var(--background))]" />
      </div>
    )
  }

  if (mode === 'topNav') {
    return (
      <div
        className={cn(
          'h-10 w-16 overflow-hidden rounded border bg-[hsl(var(--background))]',
          active ? 'border-[hsl(var(--primary)/0.45)]' : 'border-[hsl(var(--border))]'
        )}
      >
        <div className="h-3 w-full bg-[hsl(var(--muted))]" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'h-10 w-16 overflow-hidden rounded border bg-[hsl(var(--background))]',
        active ? 'border-[hsl(var(--primary)/0.45)]' : 'border-[hsl(var(--border))]'
      )}
    >
      <div className="h-3 w-full bg-[hsl(var(--muted))]" />
      <div className="mt-0.5 flex h-[calc(100%-0.875rem)]">
        <div className="w-4 bg-[hsl(var(--muted)/0.9)]" />
        <div className="flex-1" />
      </div>
    </div>
  )
}

SettingsPage.routeMeta = {
  path: '/settings',
  titleKey: 'menuSettings',
  layout: 'dashboard',
  inMenu: true,
  order: 4,
  icon: 'Settings',
}

export default SettingsPage
