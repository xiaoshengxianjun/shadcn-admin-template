import { LayoutDashboard, Settings, ShieldCheck, Users, type LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'

import type { PageRouteMeta, RouteIconName } from '@/types/route'

type PageModule = {
  default: ComponentType & { routeMeta?: PageRouteMeta }
}

export type AppRoute = PageRouteMeta & {
  component: ComponentType
  iconComponent?: LucideIcon
}

const iconMap: Record<RouteIconName, LucideIcon> = {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Settings,
}

const pageModules = import.meta.glob('/src/pages/*-page.tsx', {
  eager: true,
}) as Record<string, PageModule>

export const appRoutes: AppRoute[] = Object.values(pageModules)
  .flatMap((module) => {
    const routeMeta = module.default.routeMeta
    if (!routeMeta) return []
    return [{
      ...routeMeta,
      component: module.default,
      iconComponent: routeMeta.icon ? iconMap[routeMeta.icon] : undefined,
    }]
  })
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
