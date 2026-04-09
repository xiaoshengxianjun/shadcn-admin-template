import { useRef, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type IconDropdownProps = {
  icon: LucideIcon
  ariaLabel: string
  title?: string
  widthClassName?: string
  panelSide?: 'down' | 'up'
  children: ReactNode
}

export function IconDropdown({
  icon: Icon,
  ariaLabel,
  title,
  widthClassName,
  panelSide = 'down',
  children,
}: IconDropdownProps) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<number | null>(null)

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const openPanel = () => {
    clearCloseTimer()
    setOpen(true)
  }

  const closePanel = () => {
    clearCloseTimer()
    closeTimer.current = window.setTimeout(() => {
      setOpen(false)
    }, 120)
  }

  return (
    <div
      className="relative"
      onMouseEnter={openPanel}
      onMouseLeave={closePanel}
      onFocus={openPanel}
      onBlur={closePanel}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Icon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
      </Button>

      <div
        className={cn(
          'absolute left-1/2 z-30 w-full -translate-x-1/2 transition-opacity duration-150',
          panelSide === 'down' ? 'top-full pt-2' : 'bottom-full pb-2',
          widthClassName ?? 'w-44',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setOpen(false)}
      >
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg">
          {title ? (
            <div className="px-2 py-1 text-xs text-[hsl(var(--muted-foreground))]">{title}</div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  )
}
