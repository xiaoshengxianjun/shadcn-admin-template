import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** 布局视口宽度（不含纵向滚动条占位），用于判断面板是否超出右缘 */
function getLayoutViewportWidth() {
  if (typeof document === 'undefined') {
    return 0
  }
  const el = document.documentElement
  const w = el?.clientWidth
  if (w && w > 0) {
    return w
  }
  return window.innerWidth
}

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
  const [upPanelMaxHeightPx, setUpPanelMaxHeightPx] = useState<number | undefined>(undefined)
  const [viewportShiftX, setViewportShiftX] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const openPanel = () => {
    clearCloseTimer()
    setViewportShiftX(0)
    setOpen(true)
  }

  const closePanel = () => {
    clearCloseTimer()
    closeTimer.current = window.setTimeout(() => {
      setOpen(false)
    }, 120)
  }

  useLayoutEffect(() => {
    if (!open) {
      return
    }

    const margin = 8
    let cancelled = false
    const pendingRafIds: number[] = []
    let debounceResizeObserver: number | null = null

    const scheduleRaf = (fn: () => void) => {
      const id = requestAnimationFrame(() => {
        if (!cancelled) {
          fn()
        }
      })
      pendingRafIds.push(id)
    }

    const updateMaxHeight = () => {
      if (panelSide !== 'up') {
        return
      }
      const trigger = rootRef.current?.querySelector('button')
      if (!trigger) {
        return
      }
      const rect = trigger.getBoundingClientRect()
      const topGap = 12
      const availableAbove = rect.top - topGap
      setUpPanelMaxHeightPx(Math.max(140, Math.min(availableAbove, window.innerHeight * 0.72)))
    }

    /** 相对「当前已渲染位置」的水平修正量（与 translateX 增量一致） */
    const measureHorizontalDelta = () => {
      const panelEl = panelRef.current
      if (!panelEl) {
        return 0
      }
      const vw = getLayoutViewportWidth()
      const pr = panelEl.getBoundingClientRect()
      let delta = 0
      if (pr.right > vw - margin) {
        delta += vw - margin - pr.right
      }
      const leftAfter = pr.left + delta
      if (leftAfter < margin) {
        delta += margin - leftAfter
      }
      return delta
    }

    /**
     * 连续 2 帧、每帧最多 1 次修正：足够收敛常见 subpixel/高度变化，又不会在多路回调下把 prev+delta 连加十几次。
     */
    const runBoundedHorizontalFit = () => {
      scheduleRaf(() => {
        const d0 = measureHorizontalDelta()
        if (Math.abs(d0) >= 0.5) {
          setViewportShiftX((prev) => prev + d0)
        }
        scheduleRaf(() => {
          const d1 = measureHorizontalDelta()
          if (Math.abs(d1) >= 0.5) {
            setViewportShiftX((prev) => prev + d1)
          }
        })
      })
    }

    const kickLayout = () => {
      updateMaxHeight()
      scheduleRaf(() => {
        updateMaxHeight()
        scheduleRaf(() => {
          runBoundedHorizontalFit()
        })
      })
    }

    kickLayout()

    const onResize = () => {
      updateMaxHeight()
      scheduleRaf(() => {
        runBoundedHorizontalFit()
      })
    }

    window.addEventListener('resize', onResize)

    const panelEl = panelRef.current
    const resizeObserver =
      panelEl && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            if (cancelled) {
              return
            }
            updateMaxHeight()
            if (debounceResizeObserver !== null) {
              window.clearTimeout(debounceResizeObserver)
            }
            debounceResizeObserver = window.setTimeout(() => {
              debounceResizeObserver = null
              if (cancelled) {
                return
              }
              scheduleRaf(() => {
                runBoundedHorizontalFit()
              })
            }, 100)
          })
        : null
    if (panelEl && resizeObserver) {
      resizeObserver.observe(panelEl)
    }

    return () => {
      cancelled = true
      pendingRafIds.forEach((id) => cancelAnimationFrame(id))
      if (debounceResizeObserver !== null) {
        window.clearTimeout(debounceResizeObserver)
      }
      window.removeEventListener('resize', onResize)
      resizeObserver?.disconnect()
    }
  }, [open, panelSide])

  const upPanelScrollStyle: CSSProperties | undefined =
    open && panelSide === 'up' && upPanelMaxHeightPx !== undefined
      ? { maxHeight: upPanelMaxHeightPx, overflowY: 'auto' }
      : undefined

  /**
   * 水平偏移必须与 open 解耦：若仅在 open 时写 transform，关闭瞬间会先丢掉 transform、再做过 opacity 动画，
   * 面板会短暂回到「未修正」的居中位置，表现为向右闪一下并可能再次顶出视口。
   */
  /** 上弹与下弹均相对触发器水平居中；-50% 为基准，viewportShiftX 由 measureHorizontalDelta 在贴边时追加修正 */
  const panelTransformStyle: CSSProperties = {
    transform: `translateX(calc(-50% + ${viewportShiftX}px))`,
  }

  return (
    <div
      ref={rootRef}
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
        onClick={() =>
          setOpen((prev) => {
            if (!prev) {
              setViewportShiftX(0)
            }
            return !prev
          })
        }
      >
        <Icon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
      </Button>

      <div
        ref={panelRef}
        className={cn(
          'absolute z-50 transition-opacity duration-150',
          panelSide === 'down' ? 'top-full left-1/2 w-full pt-2' : 'bottom-full left-1/2 w-full pb-2',
          widthClassName ?? 'w-44',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        style={panelTransformStyle}
        onClick={() => setOpen(false)}
      >
        <div
          className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg"
          style={upPanelScrollStyle}
        >
          {title ? (
            <div className="px-2 py-1 text-xs text-[hsl(var(--muted-foreground))]">{title}</div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  )
}
