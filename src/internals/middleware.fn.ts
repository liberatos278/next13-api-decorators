import { NextRequest } from "next/server"
import { HttpException, Middleware, MIDDLEWARE_TOKEN } from ".."

export function ExecuteMiddlewares(
  req: NextRequest,
  target: Function,
  propertyKey: string | symbol
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const middleware: Middleware[] =
      Reflect.getMetadata(MIDDLEWARE_TOKEN, target.constructor) ?? []

    // Get defined middleware for the property
    if (propertyKey) {
      const propertyMiddleware = Reflect.getMetadata(
        MIDDLEWARE_TOKEN,
        target,
        propertyKey
      )

      if (propertyMiddleware) {
        middleware.push(...propertyMiddleware)
      }
    }

    if (!middleware) return

    const middlewareFunctions = middleware.map((fn: Function) => {
      return fn.bind(target)
    })

    // Run all middleware functions
    // If an error is thrown, reject the promise
    const runMiddleware = async (index: number, err?: Error) => {
      const currentMiddleware = middlewareFunctions[index]

      if (err instanceof HttpException) reject(err)

      if (!currentMiddleware) return
      await currentMiddleware(req, (err?: Error) =>
        runMiddleware(index + 1, err)
      )
    }

    // Start the middleware chain
    await runMiddleware(0)
    resolve()
  })
}
