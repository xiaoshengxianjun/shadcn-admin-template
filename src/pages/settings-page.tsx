import type { FC } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLocale } from '@/hooks/use-locale'
import type { PageRouteMeta } from '@/types/route'

type PageComponent = FC & { routeMeta: PageRouteMeta }

const SettingsPage: PageComponent = () => {
  const { t } = useLocale()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('menuSettings')}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-[hsl(var(--muted-foreground))]">
        {t('menuPlaceholder')}
      </CardContent>
    </Card>
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
