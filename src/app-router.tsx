import { useSyncExternalStore, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { authApi } from '@/api'
import { DashboardLayout } from '@/components/dashboard-layout'
import { appRoutes } from '@/config/routes'

type RedirectState = {
  redirectTo?: string
}

function resolveRedirectPath(redirectTo: string | undefined, fallbackPath: string) {
  if (!redirectTo || !redirectTo.startsWith('/') || redirectTo.startsWith('//')) {
    return fallbackPath
  }
  return redirectTo
}

type ProtectedDashboardRouteProps = {
  isAuthenticated: boolean
  loginPath: string
  children: ReactNode
}

function ProtectedDashboardRoute({
  isAuthenticated,
  loginPath,
  children,
}: ProtectedDashboardRouteProps) {
  const location = useLocation()

  if (!isAuthenticated) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to={loginPath} replace state={{ redirectTo }} />
  }

  return <DashboardLayout>{children}</DashboardLayout>
}

type GuestOnlyRouteProps = {
  isAuthenticated: boolean
  fallbackPath: string
  children: ReactNode
}

function GuestOnlyRoute({ isAuthenticated, fallbackPath, children }: GuestOnlyRouteProps) {
  const location = useLocation()

  if (isAuthenticated) {
    const state = location.state as RedirectState | null
    const redirectPath = resolveRedirectPath(state?.redirectTo, fallbackPath)
    return <Navigate to={redirectPath} replace />
  }

  return children
}

export function AppRouter() {
  const dashboardFallbackPath = appRoutes.find((route) => route.layout === 'dashboard')?.path ?? '/'
  const loginPath = appRoutes.find((route) => route.path === '/login')?.path ?? '/login'
  const accessToken = useSyncExternalStore(
    authApi.subscribeAccessToken,
    authApi.getAccessToken,
    () => null
  )
  const isAuthenticated = Boolean(accessToken)

  return (
    <BrowserRouter>
      <Routes>
        {appRoutes
          .filter((route) => route.layout === 'dashboard')
          .map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedDashboardRoute isAuthenticated={isAuthenticated} loginPath={loginPath}>
                  <route.component />
                </ProtectedDashboardRoute>
              }
            />
          ))}
        {appRoutes
          .filter((route) => route.layout === 'blank')
          .map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.path === loginPath ? (
                  <GuestOnlyRoute
                    isAuthenticated={isAuthenticated}
                    fallbackPath={dashboardFallbackPath}
                  >
                    <route.component />
                  </GuestOnlyRoute>
                ) : (
                  <route.component />
                )
              }
            />
          ))}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? dashboardFallbackPath : loginPath} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}
