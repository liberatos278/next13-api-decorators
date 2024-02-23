import { join } from "path"
import { HttpMethod, Headers } from ".."
import { FormatPath, GetBasePath } from "../internals"

export const HTTP_CODE_TOKEN = Symbol("lib:httpCode")
export const HTTP_METHOD_TOKEN = Symbol("lib:httpMethod")
export const HTTP_HEADER_TOKEN = Symbol("lib:httpHeader")

function _CreateDecorator(
  httpMethod: HttpMethod,
  extraPath?: string
): MethodDecorator {
  return function (
    target: Function | object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const basePath = GetBasePath()
    const path = FormatPath(
      join(basePath, !extraPath || extraPath === "/" ? "" : extraPath)
    )

    const payload = { httpMethod, path }
    Reflect.defineMetadata(HTTP_METHOD_TOKEN, payload, target, propertyKey)
  }
}

/**
 * Set the HTTP status code for the response if it's not explicitly specified
 * @param code - HTTP status code
 * @returns MethodDecorator
 */
export function HttpCode(code: number): MethodDecorator {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(HTTP_CODE_TOKEN, code, target, propertyKey)
  }
}

/**
 * Set the custom headers for the response. If you use it on a class, it will apply to all methods specified in the class
 * @param key - Header key
 * @param value - Header value
 * @returns MethodDecorator & ClassDecorator
 */
export function SetHeader(
  key: string,
  value: string
): MethodDecorator & ClassDecorator {
  return function (
    target: Function | object,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) {
    if (propertyKey) {
      const headers: Headers =
        Reflect.getMetadata(HTTP_HEADER_TOKEN, target, propertyKey) || {}

      headers[key] = value
      Reflect.defineMetadata(HTTP_HEADER_TOKEN, headers, target, propertyKey)
    } else {
      const headers: Headers =
        Reflect.getMetadata(HTTP_HEADER_TOKEN, target) || {}

      headers[key] = value
      Reflect.defineMetadata(HTTP_HEADER_TOKEN, headers, target)
    }
  }
}

/**
 * Define method as a GET endpoint
 * @param path - If you want to specify a custom path for the endpoint, you have to define route's folder as multiple parameters route (e.g. [...params])
 * @returns MethodDecorator
 */
export function Get(path?: string): MethodDecorator {
  return _CreateDecorator(HttpMethod.GET, path)
}

/**
 * Define method as a POST endpoint
 * @param path - If you want to specify a custom path for the endpoint, you have to define route's folder as multiple parameters route (e.g. [...params])
 * @returns MethodDecorator
 */
export function Post(path?: string): MethodDecorator {
  return _CreateDecorator(HttpMethod.POST, path)
}

/**
 * Define method as a PUT endpoint
 * @param path - If you want to specify a custom path for the endpoint, you have to define route's folder as multiple parameters route (e.g. [...params])
 * @returns MethodDecorator
 */
export function Put(path?: string): MethodDecorator {
  return _CreateDecorator(HttpMethod.PUT, path)
}

/**
 * Define method as a PATCH endpoint
 * @param path - If you want to specify a custom path for the endpoint, you have to define route's folder as multiple parameters route (e.g. [...params])
 * @returns MethodDecorator
 */
export function Patch(path?: string) {
  return _CreateDecorator(HttpMethod.PATCH, path)
}

/**
 * Define method as a DELETE endpoint
 * @param path - If you want to specify a custom path for the endpoint, you have to define route's folder as multiple parameters route (e.g. [...params])
 * @returns MethodDecorator
 */
export function Delete(path?: string): MethodDecorator {
  return _CreateDecorator(HttpMethod.DELETE, path)
}
