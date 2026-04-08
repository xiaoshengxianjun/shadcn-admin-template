import { Activity, Gauge, PlusCircle, Sparkles, Users } from 'lucide-react'
import type { FC } from 'react'

import { useLocale } from '@/hooks/use-locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { PageRouteMeta } from '@/types/route'

type PageComponent = FC & { routeMeta: PageRouteMeta }

const HomePage: PageComponent = () => {
  const { t } = useLocale()
  const stats = [
    { label: t('statVisits'), value: '2,184', icon: Users },
    { label: t('statSessions'), value: '328', icon: Activity },
    { label: t('statHealth'), value: '99.9%', icon: Gauge },
  ]

  const activities = [t('activityOne'), t('activityTwo'), t('activityThree')]

  return (
    <main className="space-y-6">
        <Card className="bg-[linear-gradient(135deg,hsl(var(--card))_10%,hsl(var(--primary)/0.12)_100%)]">
          <CardHeader>
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.8)] px-3 py-1 text-xs text-[hsl(var(--muted-foreground))]">
              <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
              {t('baseHomeTag')}
            </div>
            <CardTitle className="text-3xl">{t('homeTitle')}</CardTitle>
            <CardDescription>{t('homeDescription')}</CardDescription>
          </CardHeader>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <Card key={item.label}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardDescription>{item.label}</CardDescription>
                <item.icon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-[hsl(var(--foreground))]">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('recentActivities')}</CardTitle>
              <CardDescription>{t('recentActivitiesHint')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] px-3 py-2"
                >
                  <p className="text-sm text-[hsl(var(--foreground))]">{item}</p>
                  <Badge variant="secondary">{t('done')}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start gap-2" variant="outline">
                <PlusCircle className="h-4 w-4" />
                {t('actionCreateMenu')}
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <PlusCircle className="h-4 w-4" />
                {t('actionCreatePage')}
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <PlusCircle className="h-4 w-4" />
                {t('actionSystemSettings')}
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
  )
}

HomePage.routeMeta = {
  path: '/',
  titleKey: 'menuDashboard',
  layout: 'dashboard',
  inMenu: true,
  order: 1,
  icon: 'LayoutDashboard',
}

export default HomePage
