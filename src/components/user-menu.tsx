import { useState } from 'react'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { authApi } from '@/api'
import { useLocale } from '@/hooks/use-locale'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type UserMenuProps = {
  compact?: boolean
  panelSide?: 'down' | 'up'
}

export function UserMenu({ compact = false, panelSide = 'down' }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const { t } = useLocale()
  const navigate = useNavigate()

  const onLogout = async () => {
    setLogoutLoading(true)
    try {
      await authApi.logout()
      navigate('/login')
    } finally {
      setLogoutLoading(false)
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        className={cn('h-10 gap-2 px-2', compact ? 'w-10 justify-center p-0' : '')}
        onClick={() => setOpen((prev) => !prev)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.18)] text-sm font-semibold text-[hsl(var(--primary))]">
          A
        </span>
        <div className={cn('text-left', compact ? 'hidden' : 'hidden md:block')}>
          <p className="text-sm leading-tight">{t('userName')}</p>
        </div>
        {!compact ? <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" /> : null}
      </Button>

      {open ? (
        <div
          className={cn(
            'absolute right-0 z-20 w-52 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg',
            panelSide === 'down' ? 'top-full mt-2' : 'right-0 bottom-full mb-2'
          )}
        >
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-[hsl(var(--secondary))]">
            <User className="h-4 w-4" />
            {t('profile')}
          </button>
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-[hsl(var(--secondary))]">
            <Settings className="h-4 w-4" />
            {t('accountSettings')}
          </button>
          <button
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[hsl(var(--destructive))] hover:bg-[hsl(var(--secondary))] disabled:opacity-60"
            onClick={onLogout}
            disabled={logoutLoading}
          >
            <LogOut className="h-4 w-4" />
            {logoutLoading ? t('signingOut') : t('signOut')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
