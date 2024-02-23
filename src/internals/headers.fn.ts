import { HTTP_HEADER_TOKEN, Headers } from ".."

export function GetHeaders(
  target: Function | object,
  propertyKey?: string | symbol
): Headers {
  let headers: Headers =
    Reflect.getMetadata(HTTP_HEADER_TOKEN, target.constructor) || {}

  if (propertyKey) {
    const propertyHeaders =
      Reflect.getMetadata(HTTP_HEADER_TOKEN, target, propertyKey) || {}

    headers = { ...headers, ...propertyHeaders }
  }

  return headers
}
