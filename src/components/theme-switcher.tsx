import { Palette } from 'lucide-react'
import { useTheme } from 'next-themes'

import { IconDropdown } from '@/components/icon-dropdown'
import { useLocale } from '@/hooks/use-locale'
import { Button } from '@/components/ui/button'
import type { ThemeName } from '@/types/theme'
import { THEME_OPTIONS } from '@/types/theme'

export function ThemeSwitcher() {
  const { locale, t } = useLocale()
  const { theme, setTheme } = useTheme()

  return (
    <IconDropdown icon={Palette} ariaLabel={t('theme')} title={t('theme')} widthClassName="w-48">
      {THEME_OPTIONS.map((item) => {
        const active = theme === item.value
        return (
          <Button
            key={item.value}
            type="button"
            variant={active ? 'default' : 'ghost'}
            className="h-8 w-full justify-start gap-2 px-2 text-xs"
            onClick={() => setTheme(item.value as ThemeName)}
          >
            <span
              className="h-3 w-3 rounded-full border border-[hsl(var(--border))]"
              style={{ backgroundColor: item.previewColor }}
            />
            {locale === 'zh-CN' ? item.labelZh : item.labelEn}
          </Button>
        )
      })}
    </IconDropdown>
  )
}
