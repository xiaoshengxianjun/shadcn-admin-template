import { useState } from 'react'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { authApi } from '@/api'
import { useLocale } from '@/hooks/use-locale'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type UserMenuProps = {
  compact?: boolean
  panelSide?: 'down' | 'up'
}

export function UserMenu({ compact = false, panelSide = 'down' }: UserMenuProps) {
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
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" className={cn('h-10 gap-2 px-2', compact ? 'w-10 justify-center p-0' : '')}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.18)] text-sm font-semibold text-[hsl(var(--primary))]">
            A
          </span>
          <div className={cn('text-left', compact ? 'hidden' : 'hidden md:block')}>
            <p className="text-sm leading-tight">{t('userName')}</p>
          </div>
          {!compact ? <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" /> : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side={panelSide === 'up' ? 'top' : 'bottom'}
        className="w-52"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="h-4 w-4" />
            {t('profile')}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="h-4 w-4" />
            {t('accountSettings')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-[hsl(var(--destructive))]"
          disabled={logoutLoading}
          onSelect={(event) => {
            if (logoutLoading) {
              event.preventDefault()
              return
            }
            void onLogout()
          }}
        >
          <LogOut className="h-4 w-4" />
          {logoutLoading ? t('signingOut') : t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
