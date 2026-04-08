export type ApiResponse<T> = {
  code: number
  message: string
  data: T
}

export type ApiError = Error & {
  code?: number
}
