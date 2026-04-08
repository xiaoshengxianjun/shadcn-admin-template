import { registerMockHandler } from '@/api/request'
import type { ApiResponse } from '@/api/types'
import type { LoginPayload, LoginResult } from '@/api/modules/auth'

const LOGIN_ACCOUNT = 'admin'
const LOGIN_PASSWORD = '123456'

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

function success<T>(data: T, message = 'ok'): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
  }
}

function fail(message: string, code = 401): ApiResponse<null> {
  return {
    code,
    message,
    data: null,
  }
}

registerMockHandler('POST', '/api/auth/login', async (_url, options) => {
  await wait(500)
  const payload = (options.body ?? {}) as LoginPayload

  if (payload.account === LOGIN_ACCOUNT && payload.password === LOGIN_PASSWORD) {
    return success<LoginResult>({
      token: 'mock-token-admin',
      user: {
        id: '1',
        name: 'Admin',
        email: 'admin@example.com',
      },
    })
  }

  return fail('账号或密码错误')
})

registerMockHandler('POST', '/api/auth/logout', async () => {
  await wait(300)
  return success<null>(null)
})
