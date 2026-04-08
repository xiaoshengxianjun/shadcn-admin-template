import { useMemo, useState, type FormEvent } from 'react'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { FC } from 'react'

import { authApi } from '@/api'
import type { ApiError } from '@/api/types'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocale } from '@/hooks/use-locale'
import type { PageRouteMeta } from '@/types/route'

type PageComponent = FC & { routeMeta: PageRouteMeta }

type LoginRouteState = {
  redirectTo?: string
}

function resolveRedirectPath(redirectTo: string | undefined, fallbackPath: string) {
  if (!redirectTo || !redirectTo.startsWith('/') || redirectTo.startsWith('//')) {
    return fallbackPath
  }
  return redirectTo
}

const LoginPage: PageComponent = () => {
  const { t } = useLocale()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({
    account: '',
    password: '',
    remember: true,
  })
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const errors = useMemo(() => {
    if (!submitAttempted) return { account: '', password: '' }
    return {
      account: form.account.trim() ? '' : t('requireAccount'),
      password: form.password.trim() ? '' : t('requirePassword'),
    }
  }, [form.account, form.password, submitAttempted, t])

  const hasError = Boolean(errors.account || errors.password)
  const redirectPath = resolveRedirectPath(
    (location.state as LoginRouteState | null)?.redirectTo,
    '/'
  )

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitAttempted(true)
    if (!form.account.trim() || !form.password.trim()) return

    setSubmitError('')
    setLoading(true)

    try {
      await authApi.login({
        account: form.account.trim(),
        password: form.password,
        remember: form.remember,
      })
      navigate(redirectPath, { replace: true })
    } catch (error) {
      const message = (error as ApiError).message || t('loginFailed')
      setSubmitError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page-background relative min-h-screen overflow-hidden">
      <div className="login-river-overlay pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="login-gradient-orb-a absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-[hsl(var(--primary)/0.35)] blur-3xl" />
        <div className="login-gradient-orb-b absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-[hsl(var(--accent)/0.3)] blur-3xl" />
        <div className="login-gradient-pulse absolute top-1/2 left-1/2 h-112 w-md -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.28),transparent_65%)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6">
        <div className="flex justify-end gap-2">
          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>

        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-2">
          <section className="login-gradient-flow relative hidden h-full min-h-[540px] overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[linear-gradient(140deg,hsl(var(--background))_4%,hsl(var(--primary)/0.2)_44%,hsl(var(--accent)/0.3)_100%)] p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="login-gradient-pulse absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,hsl(var(--primary)/0.34),transparent_42%),radial-gradient(circle_at_82%_76%,hsl(var(--accent)/0.3),transparent_46%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.75)] px-4 py-2 text-sm text-[hsl(var(--muted-foreground))] backdrop-blur">
                <Sparkles className="h-4 w-4 text-[hsl(var(--primary))]" />
                {t('aiTagline')}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-8 top-24 bottom-44 perspective-distant">
              <div className="login-3d-core absolute top-1/2 left-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-[2.2rem]" />
              <div className="login-3d-ring login-3d-ring-1 absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[hsl(var(--primary)/0.44)]" />
              <div className="login-3d-ring login-3d-ring-2 absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[hsl(var(--accent)/0.38)]" />
              <div className="login-3d-card login-3d-card-a absolute top-[18%] left-[12%] h-30 w-40 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.62)] backdrop-blur-xl" />
              <div className="login-3d-card login-3d-card-b absolute right-[10%] bottom-[14%] h-24 w-36 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.56)] backdrop-blur-xl" />
              <div className="login-3d-grid absolute inset-0 rounded-3xl" />
            </div>
            <div className="relative space-y-4">
              <h1 className="text-4xl leading-tight font-semibold tracking-tight text-[hsl(var(--foreground))]">
                {t('appName')}
              </h1>
              <p className="max-w-xl text-base text-[hsl(var(--muted-foreground))]">
                {t('aiDescription')}
              </p>
            </div>
          </section>

          <section className="mx-auto w-full max-w-md space-y-4">
            <div className="text-center">
              <p className="text-3xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
                {t('appName')}
              </p>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                通用管理系统基础模板
              </p>
            </div>
            <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card)/0.85)] backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl">{t('welcomeBack')}</CardTitle>
                <CardDescription>{t('loginHint')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="account">{t('account')}</Label>
                    <Input
                      id="account"
                      placeholder={t('accountPlaceholder')}
                      value={form.account}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, account: event.target.value }))
                      }
                      aria-invalid={Boolean(errors.account)}
                    />
                    {errors.account ? (
                      <p className="text-xs text-[hsl(var(--destructive))]">{errors.account}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{t('password')}</Label>
                      <button
                        type="button"
                        className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? t('hidePassword') : t('showPassword')}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('passwordPlaceholder')}
                        value={form.password}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, password: event.target.value }))
                        }
                        className="pr-10"
                        aria-invalid={Boolean(errors.password)}
                      />
                      <button
                        type="button"
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password ? (
                      <p className="text-xs text-[hsl(var(--destructive))]">{errors.password}</p>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="inline-flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
                      <input
                        type="checkbox"
                        checked={form.remember}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, remember: event.target.checked }))
                        }
                      />
                      {t('rememberMe')}
                    </label>
                    <a href="#" className="text-[hsl(var(--primary))] hover:underline">
                      {t('forgotPassword')}
                    </a>
                  </div>

                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? t('loggingIn') : t('login')}
                  </Button>

                  {submitError ? (
                    <p className="text-center text-xs text-[hsl(var(--destructive))]">{submitError}</p>
                  ) : null}

                  {submitAttempted && !hasError && !loading ? (
                    <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
                      {t('loginSuccessHint')}
                    </p>
                  ) : null}
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

LoginPage.routeMeta = {
  path: '/login',
  titleKey: 'login',
  layout: 'blank',
  inMenu: false,
  order: 0,
}

export default LoginPage
