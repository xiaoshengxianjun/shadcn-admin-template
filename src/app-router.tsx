import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { DashboardLayout } from '@/components/dashboard-layout'
import { appRoutes } from '@/config/routes'

export function AppRouter() {
  const fallbackPath = appRoutes.find((route) => route.layout === 'dashboard')?.path ?? '/'

  return (
    <BrowserRouter>
      <Routes>
        {appRoutes
          .filter((route) => route.layout === 'dashboard')
          .map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<DashboardLayout>{<route.component />}</DashboardLayout>}
            />
          ))}
        {appRoutes
          .filter((route) => route.layout === 'blank')
          .map((route) => (
            <Route key={route.path} path={route.path} element={<route.component />} />
          ))}
        <Route path="*" element={<Navigate to={fallbackPath} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
