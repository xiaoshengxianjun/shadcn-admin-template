import type { FC } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLocale } from '@/hooks/use-locale'
import type { PageRouteMeta } from '@/types/route'

type PageComponent = FC & { routeMeta: PageRouteMeta }

const RolesPage: PageComponent = () => {
  const { t } = useLocale()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('menuRoles')}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-[hsl(var(--muted-foreground))]">
        {t('menuPlaceholder')}
      </CardContent>
    </Card>
  )
}

RolesPage.routeMeta = {
  path: '/roles',
  titleKey: 'menuRoles',
  layout: 'dashboard',
  inMenu: true,
  menuGroupKey: 'menuPermission',
  order: 3,
  icon: 'ShieldCheck',
}

export default RolesPage
