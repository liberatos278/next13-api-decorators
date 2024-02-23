import { NextRequest } from "next/server"
import { match } from "path-to-regexp"
import {
  GenerateArgs,
  GetHeaders,
  ExecuteMiddlewares,
  GetExceptionHandler,
  PrepareResponse,
} from "./internals"
import {
  EndpointMetadataPayload,
  Endpoints,
  NotFoundException,
  HttpMethod,
  HttpStatus,
  HTTP_CODE_TOKEN,
  HTTP_METHOD_TOKEN,
  HttpException,
} from "."

export class ApiRouteHandler {
  public static build(): Endpoints {
    const obj = new this()

    const proto = Object.getPrototypeOf(obj)

    // Methods of extended class - endpoints
    const methods = Object.getOwnPropertyNames(proto).filter(
      (key) => key !== "constructor"
    )

    const endpoints: Endpoints = {}
    const metadata: EndpointMetadataPayload[] = []

    methods.forEach((method) => {
      const data: EndpointMetadataPayload = Reflect.getMetadata(
        HTTP_METHOD_TOKEN,
        proto,
        method
      )

      // If method is registered as an endpoint, add it to the metadata array
      if (data) {
        data.fn = obj[method as keyof ApiRouteHandler]
        data.propertyKey = method
        metadata.push(data)
      }
    })

    // All http methods used in the metadata
    const uniqueHttpMethods = Array.from(
      new Set(metadata.map((m) => m.httpMethod))
    ) as HttpMethod[]

    for (const httpMethod of uniqueHttpMethods) {
      // Getting alll endpoints for a specific http method
      const routes = metadata.filter((r) => r.httpMethod === httpMethod)

      // Main function that will be called when a request is made to the endpoint
      const fn = async (req: NextRequest) => {
        // Find the route that matches the request url
        const route = routes.find((r) => {
          const matcher = match(r.path, { decode: decodeURIComponent })
          return matcher(req.nextUrl.pathname)
        })

        try {
          if (!route) {
            throw new NotFoundException()
          }

          // Get headers for the route function in controller
          const headers = GetHeaders(proto, route.propertyKey)

          // Generate arguments for the route function in controller
          const args = await GenerateArgs(req, proto, route.propertyKey)

          // Call middlewares
          await ExecuteMiddlewares(req, proto, route.propertyKey)

          // Call main function and if it returns an exception, throw it to the catchers
          const result = await route.fn(...args)
          if (result instanceof HttpException) throw result

          const metadataStatus: HttpStatus | undefined = Reflect.getMetadata(
            HTTP_CODE_TOKEN,
            proto,
            route.propertyKey
          )

          // Return builded response
          return PrepareResponse(result, httpMethod, headers, metadataStatus)
        } catch (e: unknown) {
          if (!route) return PrepareResponse(e, httpMethod, {})

          const headers = GetHeaders(proto, route.propertyKey)

          // If an exception is thrown, check if there is a catcher for it
          const excpetionHandler = GetExceptionHandler(
            e as HttpException,
            proto,
            route.propertyKey
          )

          if (excpetionHandler) {
            // If there is a catcher, call it
            const result = await excpetionHandler.handler(
              e as HttpException,
              req
            )

            return PrepareResponse(result, httpMethod, headers)
          } else {
            // No catcher - return the exception to the client
            return PrepareResponse(e, httpMethod, headers)
          }
        }
      }

      endpoints[httpMethod] = fn
    }

    return endpoints
  }
}
