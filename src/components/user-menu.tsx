import { useState } from 'react'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'

import { useLocale } from '@/hooks/use-locale'
import { Button } from '@/components/ui/button'

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const { t } = useLocale()

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        className="h-10 gap-2 px-2"
        onClick={() => setOpen((prev) => !prev)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.18)] text-sm font-semibold text-[hsl(var(--primary))]">
          A
        </span>
        <div className="hidden text-left md:block">
          <p className="text-sm leading-tight">{t('userName')}</p>
          <p className="text-xs leading-tight text-[hsl(var(--muted-foreground))]">{t('userEmail')}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
      </Button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-lg">
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-[hsl(var(--secondary))]">
            <User className="h-4 w-4" />
            {t('profile')}
          </button>
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-[hsl(var(--secondary))]">
            <Settings className="h-4 w-4" />
            {t('accountSettings')}
          </button>
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[hsl(var(--destructive))] hover:bg-[hsl(var(--secondary))]">
            <LogOut className="h-4 w-4" />
            {t('signOut')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
