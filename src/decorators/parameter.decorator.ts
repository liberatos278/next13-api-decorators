import { ArgumentType, ParameterPipe } from ".."

export const PARAMS_TOKEN = Symbol("lib:params")

const _CreateDecorator = (
  type: ArgumentType,
  key?: string,
  pipes?: ParameterPipe<any>[]
): ParameterDecorator => {
  return function (
    target: Function | object,
    propertyKey: string | symbol | undefined,
    index: number
  ) {
    if (!propertyKey) return

    const existingParams =
      Reflect.getMetadata(PARAMS_TOKEN, target, propertyKey) || []

    existingParams.push({ index, type, key, pipes })
    Reflect.defineMetadata(PARAMS_TOKEN, existingParams, target, propertyKey)
  }
}

/**
 * Decorator to inject the request object into the method parameter
 * @returns ParameterDecorator
 */
export function Req(): ParameterDecorator {
  return _CreateDecorator("request")
}

/**
 * Decorator to inject the request object into the method parameter
 * @returns ParameterDecorator
 */
export function Request(): ParameterDecorator {
  return Req()
}

/**
 * Decorator to inject the body object into the method parameter
 * @param key - Optional key to inject specific body value
 * @param pipes - Optional pipes to be applied to the body
 * @returns ParameterDecorator
 */
export function Body(...pipes: ParameterPipe<any>[]): ParameterDecorator {
  return _CreateDecorator("body", undefined, pipes)
}

/**
 * Decorator to inject the query object (search parameters) into the method parameter
 * @param key - Optional key to inject specific query value
 * @param pipes - Optional pipes to be applied to the query
 * @returns ParameterDecorator
 */
export function Query(
  key?: string,
  ...pipes: ParameterPipe<any>[]
): ParameterDecorator {
  return _CreateDecorator("query", key, pipes)
}

/**
 * Decorator to inject the URL params object into the method parameter
 * @param key - Optional key to inject specific URL parameter value
 * @param pipes - Optional pipes to be applied to the params
 * @returns ParameterDecorator
 */
export function Param(
  key?: string,
  ...pipes: ParameterPipe<any>[]
): ParameterDecorator {
  return _CreateDecorator("param", key, pipes)
}

/**
 * Decorator to inject the headers object into the method parameter
 * @param key - Optional key to inject specific header value
 * @returns ParameterDecorator
 */
export function Header(key?: string): ParameterDecorator {
  return _CreateDecorator("header", key)
}
