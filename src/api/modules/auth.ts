import { request } from '@/api/request'

const TOKEN_KEY = 'admin-template-token'
const tokenSubscribers = new Set<() => void>()

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

function notifyTokenSubscribers() {
  for (const listener of tokenSubscribers) {
    listener()
  }
}

export function subscribeAccessToken(listener: () => void) {
  tokenSubscribers.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === TOKEN_KEY) {
      listener()
    }
  }
  window.addEventListener('storage', onStorage)

  return () => {
    tokenSubscribers.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY)
  notifyTokenSubscribers()
}

export async function login(payload: LoginPayload) {
  const data = await request<LoginResult>('/api/auth/login', {
    method: 'POST',
    body: payload,
  })

  localStorage.setItem(TOKEN_KEY, data.token)
  notifyTokenSubscribers()
  return data
}

export async function logout() {
  await request<null>('/api/auth/logout', {
    method: 'POST',
  })
  clearAccessToken()
}
