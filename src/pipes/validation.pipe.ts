import {
  BadRequestException,
  ParameterPipe,
  PipeMetadata,
  PipeOptions,
  ValidationPipeOptions,
} from ".."
import { ValidateObject } from "../internals"

export function ValidationPipe(
  options?: ValidationPipeOptions
): ParameterPipe<any> {
  return (value: any, metadata?: PipeMetadata) => {
    if (!metadata?.metaType) {
      return value
    }

    return ValidateObject(metadata?.metaType, value, options)
  }
}

export function ValidatePipeOptions(
  value: any,
  name?: string,
  options?: PipeOptions
) {
  if (
    !options?.nullable &&
    (value == null || value.toString().trim().length === 0)
  ) {
    throw new BadRequestException(
      name
        ? `${name} is a required parameter.`
        : "Missing a required parameter."
    )
  }
}
