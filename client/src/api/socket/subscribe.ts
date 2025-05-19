import { z, ZodError } from 'zod'
import { getSocket } from './index'
import { handleValidationError } from '..'
import { ApiErrorResponse } from '../types'

type Handler<T> = (data: T) => void
type ErrorHandler = (error: ApiErrorResponse) => void

export default function subscribeSocketEvent<T>(
  event: string,
  schema: z.ZodType<T> | null,
  onValid: Handler<T>,
  onError?: ErrorHandler
) {
  const socket = getSocket()

  socket.on(event, (data: unknown) => {
    if (!schema) {
      onValid(data as T)
      return
    }

    const parsed = schema.safeParse(data)

    if (!parsed.success) {
      const error = handleValidationError(parsed.error)
      if (onError) {
        onError(error)
      } else {
        console.warn(`❗ Invalid data for socket event '${event}':`, error)
      }
      return
    }

    onValid(parsed.data)
  })
}
