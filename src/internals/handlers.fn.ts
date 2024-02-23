import { ExceptionHandler, HttpException, CATCH_TOKEN } from ".."

export function GetExceptionHandler(
  exception: HttpException,
  target: object | Function,
  propertyKey?: string | symbol
): ExceptionHandler<any> | null {
  const handlers = Reflect.getMetadata(CATCH_TOKEN, target.constructor) ?? []

  // Get defined handlers for the property
  if (propertyKey) {
    const propertyCatchers = Reflect.getMetadata(
      CATCH_TOKEN,
      target,
      propertyKey
    )
    if (propertyCatchers) {
      handlers.push(...propertyCatchers)
    }
  }

  if (!handlers) return null

  // Find the handler for the exception
  return handlers.find(({ exceptionType }: { exceptionType: Function }) => {
    if (!exceptionType) return true
    return exception instanceof exceptionType
  })
}
