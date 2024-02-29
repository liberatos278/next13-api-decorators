import { NextRequest } from "next/server"
import { match } from "path-to-regexp"
import { ClassConstructor } from "class-transformer"
import {
  HTTP_METHOD_TOKEN,
  EndpointMetadataPayload,
  ParameterMetadataPayload,
  Headers,
  QueryParameters,
  UrlParameters,
  PARAMS_TOKEN,
} from ".."

export async function GenerateArgs(
  request: NextRequest,
  target: Function,
  propertyKey: string
): Promise<any[]> {
  // Get requested parameters by controller method
  const args: ParameterMetadataPayload[] = Reflect.getMetadata(
    PARAMS_TOKEN,
    target,
    propertyKey
  )

  // Get the types of the parameters for validation
  const paramTypes: ClassConstructor<any>[] = Reflect.getMetadata(
    "design:paramtypes",
    target,
    propertyKey
  )

  if (!args) return []

  let newArgs = new Array(args.length)

  // Iterate over the parameters and get the values from the request
  for (const arg of args) {
    switch (arg.type) {
      case "body":
        const body = await request.json().catch(() => ({}))
        newArgs[arg.index] = body
        break

      case "request":
        newArgs[arg.index] = request
        break

      case "query":
        const searchParams = request.nextUrl.searchParams

        if (arg.key) {
          newArgs[arg.index] = searchParams.get(arg.key)
        } else {
          const queries: QueryParameters = {}
          searchParams.forEach((value, key) => {
            queries[key] = value
          })

          newArgs[arg.index] = queries
        }
        break

      case "param":
        const data: EndpointMetadataPayload = Reflect.getMetadata(
          HTTP_METHOD_TOKEN,
          target,
          propertyKey
        )

        const matcher = match(data.path, { decode: decodeURIComponent })
        const result = matcher(request.nextUrl.pathname)

        if (!result) break
        const params = result.params as UrlParameters

        if (arg.key) {
          newArgs[arg.index] = params[arg.key]
        } else {
          newArgs[arg.index] = params
        }
        break

      case "header":
        if (arg.key) {
          newArgs[arg.index] = request.headers.get(arg.key)
        } else {
          const headers: Headers = {}
          request.headers.forEach((value, key) => {
            headers[key] = value
          })

          newArgs[arg.index] = headers
        }
        break
    }

    // If the parameter is a class, validate it
    const paramType = paramTypes[arg.index]
    const { key, pipes } = arg

    if (pipes && pipes.length) {
      for (const pipeFn of pipes) {
        newArgs[arg.index] = pipeFn.name
          ? await pipeFn
              .call(null, null)
              .call(null, newArgs[arg.index], { key, metaType: paramType })
          : await pipeFn.call(null, newArgs[arg.index], {
              name: key,
              metaType: paramType,
            })
      }
    }
  }

  return newArgs
}
