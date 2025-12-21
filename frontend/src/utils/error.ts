import axios from 'axios'

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as Record<string, any> | undefined
    return (
      data?.error ||
      data?.detail ||
      data?.message ||
      err.message ||
      'Request failed'
    )
  }
  if (err instanceof Error) {
    return err.message
  }
  return 'Request failed'
}
