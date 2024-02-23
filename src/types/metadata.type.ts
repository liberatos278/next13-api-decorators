import { ArgumentType, HttpMethod, ParameterPipe } from "."

export interface EndpointMetadataPayload {
  propertyKey: string
  httpMethod: HttpMethod
  path: string
  basePath: string
  fn: Function
}

export interface ParameterMetadataPayload {
  index: number
  type: ArgumentType
  key?: string
  pipes?: ParameterPipe<any>[]
}
