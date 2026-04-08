import type { ApiError, ApiResponse } from '@/api/types'

type QueryValue = string | number | boolean | null | undefined
type RequestParams = Record<string, QueryValue>

type RequestOptions = Omit<RequestInit, 'body'> & {
  params?: RequestParams
  body?: unknown
}

type MockHandler = (url: string, options: RequestOptions) => Promise<unknown> | unknown

const mockHandlers = new Map<string, MockHandler>()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const ENABLE_MOCK =
  import.meta.env.VITE_API_USE_MOCK === 'true' ||
  (import.meta.env.VITE_API_USE_MOCK !== 'false' && import.meta.env.DEV)

function getMockKey(method: string, path: string) {
  return `${method.toUpperCase()} ${path}`
}

function buildQueryString(params?: RequestParams) {
  if (!params) return ''
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return
    searchParams.append(key, String(value))
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

function getRequestUrl(path: string, params?: RequestParams) {
  return `${API_BASE_URL}${path}${buildQueryString(params)}`
}

function createApiError(message: string, code?: number): ApiError {
  const error = new Error(message) as ApiError
  if (code !== undefined) error.code = code
  return error
}

export function registerMockHandler(method: string, path: string, handler: MockHandler) {
  mockHandlers.set(getMockKey(method, path), handler)
}

export async function request<T>(path: string, options: RequestOptions = {}) {
  const method = options.method?.toUpperCase() ?? 'GET'
  const requestUrl = getRequestUrl(path, options.params)

  if (ENABLE_MOCK) {
    const mockHandler = mockHandlers.get(getMockKey(method, path))
    if (mockHandler) {
      const response = (await mockHandler(requestUrl, options)) as ApiResponse<T>
      if (response.code !== 0) {
        throw createApiError(response.message, response.code)
      }
      return response.data
    }
  }

  const response = await fetch(requestUrl, {
    ...options,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    throw createApiError(`HTTP error: ${response.status}`, response.status)
  }

  const result = (await response.json()) as ApiResponse<T>
  if (result.code !== 0) {
    throw createApiError(result.message, result.code)
  }

  return result.data
}
