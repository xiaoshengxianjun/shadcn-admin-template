import { request } from '@/api/request'

const TOKEN_KEY = 'admin-template-token'

export type LoginPayload = {
  account: string
  password: string
  remember: boolean
}

export type LoginUser = {
  id: string
  name: string
  email: string
}

export type LoginResult = {
  token: string
  user: LoginUser
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function login(payload: LoginPayload) {
  const data = await request<LoginResult>('/api/auth/login', {
    method: 'POST',
    body: payload,
  })

  localStorage.setItem(TOKEN_KEY, data.token)
  return data
}

export async function logout() {
  await request<null>('/api/auth/logout', {
    method: 'POST',
  })
  clearAccessToken()
}
