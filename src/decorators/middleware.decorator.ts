import { Middleware } from ".."

export const MIDDLEWARE_TOKEN = Symbol("lib:middlewares")

/**
 * Create your own middleware decorator that can be applied to the method or class
 * @param middleware - Middleware function to be applied
 * @returns ClassDecorator & MethodDecorator
 */
export function CreateMiddlewareDecorator(middleware: Middleware) {
  return () =>
    (target: object, propertyKey: string | symbol): void => {
      const definedMiddlewares: Middleware[] =
        (propertyKey
          ? Reflect.getMetadata(MIDDLEWARE_TOKEN, target, propertyKey)
          : Reflect.getMetadata(MIDDLEWARE_TOKEN, target)) ?? []

      definedMiddlewares.unshift(middleware)

      if (propertyKey) {
        Reflect.defineMetadata(
          MIDDLEWARE_TOKEN,
          definedMiddlewares,
          target,
          propertyKey
        )
      } else {
        Reflect.defineMetadata(MIDDLEWARE_TOKEN, definedMiddlewares, target)
      }
    }
}

export function UseMiddleware(
  ...middlewares: Middleware[]
): ClassDecorator & MethodDecorator {
  return function (target: object, propertyKey?: string | symbol) {
    middlewares
      .reverse()
      .forEach((middleware) =>
        CreateMiddlewareDecorator(middleware)()(target, propertyKey as string)
      )
  }
}
