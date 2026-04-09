import { Languages } from 'lucide-react'

import { IconDropdown } from '@/components/icon-dropdown'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/hooks/use-locale'
import { LOCALE_OPTIONS, type Locale } from '@/types/locale'

type LocaleSwitcherProps = {
  panelSide?: 'down' | 'up'
}

export function LocaleSwitcher({ panelSide = 'down' }: LocaleSwitcherProps) {
  const { locale, setLocale, t } = useLocale()

  return (
    <IconDropdown
      icon={Languages}
      ariaLabel={t('language')}
      title={t('language')}
      widthClassName="w-40"
      panelSide={panelSide}
    >
      {LOCALE_OPTIONS.map((item) => {
        const active = item.value === locale
        return (
          <Button
            key={item.value}
            type="button"
            variant={active ? 'default' : 'ghost'}
            className="h-8 w-full justify-start px-2 text-xs"
            onClick={() => setLocale(item.value as Locale)}
          >
            {item.label}
          </Button>
        )
      })}
    </IconDropdown>
  )
}
