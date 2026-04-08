import { AppRouter } from '@/app-router'
import { LocaleProvider } from '@/components/locale-provider'
import { ThemeProvider } from '@/components/theme-provider'

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
        <AppRouter />
      </LocaleProvider>
    </ThemeProvider>
  )
}

export default App
