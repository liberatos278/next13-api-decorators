import { ClassConstructor } from "class-transformer"
import { NextRequest } from "next/server"

export type ExceptionHandlerFunction<T> = (error: T, req: NextRequest) => any

export interface ExceptionHandler<T> {
  handler: ExceptionHandlerFunction<T>
  exceptionType?: ClassConstructor<T>
}
