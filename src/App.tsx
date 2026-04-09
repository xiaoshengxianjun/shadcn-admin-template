import { AppRouter } from '@/app-router'
import { LocaleProvider } from '@/components/locale-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      themes={['light', 'dark', 'deep-violet', 'deep-green', 'peach-light', 'warm-yellow']}
      storageKey="admin-template-theme"
    >
      <LocaleProvider>
        <TooltipProvider>
          <AppRouter />
        </TooltipProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}

export default App
