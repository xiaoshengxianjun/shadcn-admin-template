import { LayoutPanelLeft, PanelsTopLeft, Rows3 } from 'lucide-react'

import { IconDropdown } from '@/components/icon-dropdown'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/hooks/use-locale'
import { cn } from '@/lib/utils'
import type { LayoutMode } from '@/types/layout'
import { LAYOUT_OPTIONS } from '@/types/layout'

type LayoutSwitcherProps = {
  layoutMode: LayoutMode
  onChange: (layoutMode: LayoutMode) => void
  panelSide?: 'down' | 'up'
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

export function LayoutSwitcher({ layoutMode, onChange, panelSide = 'down' }: LayoutSwitcherProps) {
  const { t } = useLocale()

  return (
    <IconDropdown
      icon={PanelsTopLeft}
      ariaLabel={t('layout')}
      title={t('layout')}
      widthClassName="w-72"
      panelSide={panelSide}
    >
      {LAYOUT_OPTIONS.map((item) => {
        const active = item.value === layoutMode
        const ItemIcon = layoutIconMap[item.value]
        return (
          <Button
            key={item.value}
            type="button"
            variant="ghost"
            className={cn(
              'h-auto w-full items-start justify-start gap-3 whitespace-normal rounded-md px-2 py-2 text-left',
              active ? 'bg-[hsl(var(--primary)/0.12)]' : ''
            )}
            onClick={() => onChange(item.value)}
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
                <span
                  className={cn(
                    'truncate text-xs font-medium',
                    active ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--foreground))]'
                  )}
                >
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
    </IconDropdown>
  )
}
