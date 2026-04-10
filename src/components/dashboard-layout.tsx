import { ChevronDown, PanelLeftClose, PanelLeftOpen, Sparkles, ShieldCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

import { LayoutSwitcher } from '@/components/layout-switcher'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { UserMenu } from '@/components/user-menu'
import { Button } from '@/components/ui/button'
import { appRoutes } from '@/config/routes'
import { useLayoutMode } from '@/hooks/use-layout-mode'
import { useLocale } from '@/hooks/use-locale'
import { cn } from '@/lib/utils'

type DashboardLayoutProps = {
  children: ReactNode
}

type CollapsedTooltipProps = {
  enabled: boolean
  label: string
  children: ReactNode
}

function CollapsedTooltip({ enabled, label, children }: CollapsedTooltipProps) {
  if (!enabled) {
    return children
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation()
  const { t } = useLocale()
  const { layoutMode, setLayoutMode } = useLayoutMode()
  const [collapsed, setCollapsed] = useState(false)
  const [permissionOpen, setPermissionOpen] = useState(true)
  const [permissionFlyoutOpen, setPermissionFlyoutOpen] = useState(false)
  const [topNavPermissionOpen, setTopNavPermissionOpen] = useState(false)
  const permissionFlyoutCloseTimerRef = useRef<number | null>(null)

  const menuRoutes = appRoutes.filter((route) => route.inMenu)
  const topLevelRoutes = menuRoutes.filter((route) => !route.menuGroupKey)
  const permissionRoutes = menuRoutes.filter((route) => route.menuGroupKey === 'menuPermission')

  const isRouteActive = (routePath: string) =>
    routePath === '/'
      ? location.pathname === '/'
      : location.pathname === routePath || location.pathname.startsWith(`${routePath}/`)

  const permissionActive = permissionRoutes.some((route) => isRouteActive(route.path))

  const clearPermissionFlyoutCloseTimer = () => {
    if (permissionFlyoutCloseTimerRef.current !== null) {
      window.clearTimeout(permissionFlyoutCloseTimerRef.current)
      permissionFlyoutCloseTimerRef.current = null
    }
  }

  const openPermissionFlyout = () => {
    clearPermissionFlyoutCloseTimer()
    setPermissionFlyoutOpen(true)
  }

  const schedulePermissionFlyoutClose = () => {
    clearPermissionFlyoutCloseTimer()
    permissionFlyoutCloseTimerRef.current = window.setTimeout(() => {
      setPermissionFlyoutOpen(false)
      permissionFlyoutCloseTimerRef.current = null
    }, 120)
  }

  useEffect(() => {
    return () => clearPermissionFlyoutCloseTimer()
  }, [])

  const headerActions = (
    <div className="flex items-center gap-2">
      <LayoutSwitcher layoutMode={layoutMode} onChange={setLayoutMode} />
      <LocaleSwitcher />
      <ThemeSwitcher />
      <UserMenu />
    </div>
  )

  const sidebarActions = (
    <div className="relative z-50 shrink-0 overflow-visible border-t border-[hsl(var(--border))] p-2">
      <div className="flex items-center gap-1 overflow-visible">
        <LayoutSwitcher layoutMode={layoutMode} onChange={setLayoutMode} panelSide="up" />
        <LocaleSwitcher panelSide="up" />
        <ThemeSwitcher panelSide="up" />
        <div className="ml-auto">
          <UserMenu compact panelSide="up" />
        </div>
      </div>
    </div>
  )

  const renderBrand = (iconOnly: boolean) => (
    <div className="flex h-16 items-center justify-center border-b border-[hsl(var(--border))] px-3">
      {iconOnly ? (
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[hsl(var(--border))] bg-[linear-gradient(145deg,hsl(var(--primary)/0.2),hsl(var(--accent)/0.22))] text-[hsl(var(--primary))]">
          <Sparkles className="h-4 w-4" />
        </div>
      ) : (
        <div className="inline-flex max-w-full items-center justify-center gap-2">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[hsl(var(--border))] bg-[linear-gradient(145deg,hsl(var(--primary)/0.2),hsl(var(--accent)/0.22))] text-[hsl(var(--primary))]">
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="truncate text-sm font-semibold tracking-[0.01em] text-[hsl(var(--foreground))]">
            {t('appName')}
          </p>
        </div>
      )}
    </div>
  )

  const renderPermissionChildren = () => (
    <div className="space-y-1 pl-4">
      {permissionRoutes.map((route) => {
        const active = isRouteActive(route.path)
        const Icon = route.iconComponent
        return (
          <Link
            key={route.path}
            to={route.path}
            className={cn(
              'flex items-center rounded-md px-3 py-2 text-sm transition-colors',
              active
                ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
                : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]'
            )}
          >
            {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
            <span className="truncate">{t(route.titleKey)}</span>
          </Link>
        )
      })}
    </div>
  )

  const renderSidebarNav = (isCollapsed: boolean) => (
    <nav className="relative space-y-1">
      {topLevelRoutes.map((route) => {
        const active = isRouteActive(route.path)
        const Icon = route.iconComponent

        return (
          <CollapsedTooltip key={route.path} enabled={isCollapsed} label={t(route.titleKey)}>
            <Link
              to={route.path}
              className={cn(
                'flex items-center rounded-md py-2 text-sm transition-[background-color,color,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--card))]',
                isCollapsed ? 'justify-center px-0' : 'px-3',
                active
                  ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.08)]'
                  : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]'
              )}
            >
              {Icon ? <Icon className={cn('h-4 w-4', isCollapsed ? '' : 'mr-2')} /> : null}
              <span className={cn('truncate', isCollapsed ? 'hidden' : 'inline')}>{t(route.titleKey)}</span>
            </Link>
          </CollapsedTooltip>
        )
      })}

      {isCollapsed ? (
        <div
          className="relative w-full"
          onMouseEnter={openPermissionFlyout}
          onMouseLeave={schedulePermissionFlyoutClose}
        >
          <button
            type="button"
            className={cn(
              'flex w-full items-center rounded-md py-2 text-sm transition-[background-color,color,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--card))]',
              'justify-center px-0',
              permissionActive
                ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.08)]'
                : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]'
            )}
            onClick={() => {
              clearPermissionFlyoutCloseTimer()
              setPermissionFlyoutOpen((prev) => !prev)
            }}
            onFocus={openPermissionFlyout}
            onBlur={schedulePermissionFlyoutClose}
            aria-expanded={permissionFlyoutOpen}
            aria-haspopup="menu"
          >
            <ShieldCheck className="h-4 w-4" />
          </button>

          <div
            className={cn(
              'absolute top-1/2 left-full z-50 -translate-y-1/2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1.5 shadow-[0_16px_40px_hsl(var(--foreground)/0.12)] ring-1 ring-[hsl(var(--border)/0.5)] transition-[opacity,transform] duration-200 ease-out',
              permissionFlyoutOpen
                ? 'pointer-events-auto translate-x-1 opacity-100'
                : 'pointer-events-none translate-x-0.5 opacity-0'
            )}
            onMouseEnter={openPermissionFlyout}
            onMouseLeave={schedulePermissionFlyoutClose}
            role="menu"
          >
            <div className="px-2 py-1 text-xs font-medium text-[hsl(var(--muted-foreground))]">
              {t('menuPermission')}
            </div>
            {permissionRoutes.map((route) => {
              const active = isRouteActive(route.path)
              const Icon = route.iconComponent
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm transition-[background-color,color,transform] duration-200 ease-out',
                    active
                      ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
                      : 'text-[hsl(var(--muted-foreground))] hover:translate-x-0.5 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]'
                  )}
                  role="menuitem"
                >
                  {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
                  <span className="truncate">{t(route.titleKey)}</span>
                </Link>
              )
            })}
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            className={cn(
              'flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors',
              permissionActive
                ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
                : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]'
            )}
            onClick={() => setPermissionOpen((prev) => !prev)}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span className="truncate">{t('menuPermission')}</span>
            <ChevronDown
              className={cn('ml-auto h-4 w-4 transition-transform', permissionOpen ? 'rotate-180' : 'rotate-0')}
            />
          </button>
          {permissionOpen ? renderPermissionChildren() : null}
        </>
      )}
    </nav>
  )

  if (layoutMode === 'topNav') {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <header className="sticky top-0 z-20 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.95)] backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex min-w-0 items-center gap-6">
              <div className="inline-flex items-center gap-2">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[hsl(var(--border))] bg-[linear-gradient(145deg,hsl(var(--primary)/0.2),hsl(var(--accent)/0.22))] text-[hsl(var(--primary))]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="hidden truncate text-sm font-semibold text-[hsl(var(--foreground))] md:block">
                  {t('appName')}
                </p>
              </div>
              <nav className="hidden items-center gap-1 lg:flex">
                {topLevelRoutes.map((route) => {
                  const active = isRouteActive(route.path)
                  const Icon = route.iconComponent
                  return (
                    <Link
                      key={route.path}
                      to={route.path}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                        active
                          ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
                          : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]'
                      )}
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      {t(route.titleKey)}
                    </Link>
                  )
                })}
                <div
                  className="relative"
                  onMouseEnter={() => setTopNavPermissionOpen(true)}
                  onMouseLeave={() => setTopNavPermissionOpen(false)}
                >
                  <button
                    type="button"
                    className={cn(
                      'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                      permissionActive
                        ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
                        : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]'
                    )}
                    onClick={() => setTopNavPermissionOpen((prev) => !prev)}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {t('menuPermission')}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div
                    className={cn(
                      'absolute top-full left-0 z-30 mt-2 w-48 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg transition-opacity',
                      topNavPermissionOpen
                        ? 'pointer-events-auto opacity-100'
                        : 'pointer-events-none opacity-0'
                    )}
                  >
                    {permissionRoutes.map((route) => {
                      const active = isRouteActive(route.path)
                      const Icon = route.iconComponent
                      return (
                        <Link
                          key={route.path}
                          to={route.path}
                          className={cn(
                            'flex items-center rounded-md px-3 py-2 text-sm transition-colors',
                            active
                              ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]'
                              : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]'
                          )}
                        >
                          {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
                          <span className="truncate">{t(route.titleKey)}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </nav>
            </div>
            {headerActions}
          </div>
        </header>
        <main className="min-w-0 p-4 md:p-6">{children}</main>
      </div>
    )
  }

  if (layoutMode === 'leftSidebar') {
    return (
      <div className="flex min-h-screen bg-[hsl(var(--background))]">
        <aside className="relative z-30 hidden w-60 shrink-0 overflow-visible border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] md:flex md:flex-col">
          {renderBrand(false)}
          <div className="flex-1 overflow-visible p-2">{renderSidebarNav(false)}</div>
          {sidebarActions}
        </aside>
        <div className="min-w-0 flex-1">
          <main className="min-h-screen min-w-0 p-4 md:p-6">{children}</main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))]">
      <aside
        className={cn(
          'relative z-30 hidden shrink-0 overflow-visible border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-[width] duration-200 md:flex md:flex-col',
          collapsed ? 'md:w-[72px]' : 'md:w-60'
        )}
      >
        {renderBrand(collapsed)}
        <div className="flex-1 overflow-visible p-2">{renderSidebarNav(collapsed)}</div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.9)] px-4 backdrop-blur md:px-6">
          <div className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden md:inline-flex"
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>
          {headerActions}
        </header>
        <main className="min-w-0 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
