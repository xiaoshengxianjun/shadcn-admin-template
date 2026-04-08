import type { FC } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLocale } from '@/hooks/use-locale'
import type { PageRouteMeta } from '@/types/route'

type PageComponent = FC & { routeMeta: PageRouteMeta }

const UsersPage: PageComponent = () => {
  const { t } = useLocale()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('menuUsers')}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-[hsl(var(--muted-foreground))]">
        {t('menuPlaceholder')}
      </CardContent>
    </Card>
  )
}

UsersPage.routeMeta = {
  path: '/users',
  titleKey: 'menuUsers',
  layout: 'dashboard',
  inMenu: true,
  order: 2,
  icon: 'Users',
}

export default UsersPage
