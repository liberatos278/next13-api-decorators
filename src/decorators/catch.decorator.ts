import { ExceptionHandler } from ".."

export const CATCH_TOKEN = Symbol("lib:catch")

/**
 * Catch decorator to handle exceptions thrown by the method or class. If used on a class, it will apply to all methods specified in the class.
 * @param fn - Exception handler function that will be called when an exception is thrown
 * @param type - Optional exception type to catch. If not provided, the handler will be called for all exceptions
 * @returns ClassDecorator & MethodDecorator
 */
export function Catch<T>(
  fn: ExceptionHandler<T>["handler"],
  type?: ExceptionHandler<T>["exceptionType"]
): ClassDecorator & MethodDecorator {
  return function (target: Function | object, propertyKey?: string | symbol) {
    const handlers: ExceptionHandler<T>[] =
      (propertyKey
        ? Reflect.getMetadata(CATCH_TOKEN, target, propertyKey)
        : Reflect.getMetadata(CATCH_TOKEN, target)) ?? []

    handlers.unshift({ handler: fn, exceptionType: type })

    if (propertyKey) {
      Reflect.defineMetadata(CATCH_TOKEN, handlers, target, propertyKey)
    } else {
      Reflect.defineMetadata(CATCH_TOKEN, handlers, target)
    }
  }
}
