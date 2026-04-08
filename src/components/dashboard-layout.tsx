import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

import { LocaleSwitcher } from '@/components/locale-switcher'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { UserMenu } from '@/components/user-menu'
import { appRoutes } from '@/config/routes'
import { useLocale } from '@/hooks/use-locale'
import { cn } from '@/lib/utils'

type DashboardLayoutProps = {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation()
  const { t } = useLocale()

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <header className="sticky top-0 z-20 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.9)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 md:px-6">
          <div className="text-sm font-medium text-[hsl(var(--foreground))]">{t('appName')}</div>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeSwitcher />
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-4 p-4 md:grid-cols-[240px_1fr] md:gap-6 md:p-6">
        <aside className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
          <nav className="space-y-1">
            {appRoutes
              .filter((route) => route.inMenu)
              .map((route) => {
                const active = route.path === location.pathname
                const Icon = route.iconComponent

                return (
                  <Link
                    key={route.path}
                    to={route.path}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
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
          </nav>
        </aside>

        <section className="min-w-0">{children}</section>
      </div>
    </div>
  )
}
