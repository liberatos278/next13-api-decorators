import type { ClassConstructor } from "class-transformer"
import { BadRequestException } from ".."
import type { ValidationPipeOptions } from "../types"
import type { ValidationError } from "class-validator"
import * as classValidator from "class-validator"
import * as classTransformer from "class-transformer"

export async function ValidateObject(
  cls: ClassConstructor<any>,
  value: string | Record<string, any>,
  validatorOptions?: ValidationPipeOptions
): Promise<any> {
  const bodyValue = classTransformer.plainToClass(cls, value, {
    enableImplicitConversion: true,
    ...validatorOptions?.transformOptions,
  })

  const validationErrors = await classValidator.validate(bodyValue, {
    enableDebugMessages: process.env.NODE_ENV === "development",
    ...validatorOptions,
  })

  if (validationErrors.length) {
    const flattenedErrors = flattenValidationErrors(validationErrors)
    throw new BadRequestException(flattenedErrors[0], flattenedErrors)
  }

  return bodyValue
}

function prependConstraintsWithParentProp(
  parentPath: string,
  error: ValidationError
): ValidationError {
  const constraints: Record<string, any> = {}
  for (const key in error.constraints) {
    constraints[key] = `${parentPath}.${error.constraints[key]}`
  }
  return {
    ...error,
    constraints,
  }
}

function mapChildrenToValidationErrors(
  error: ValidationError,
  parentPath?: string
): ValidationError[] {
  if (!(error.children && error.children.length)) {
    return [error]
  }
  const validationErrors = []
  parentPath = parentPath ? `${parentPath}.${error.property}` : error.property
  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(...mapChildrenToValidationErrors(item, parentPath))
    }
    validationErrors.push(prependConstraintsWithParentProp(parentPath, item))
  }
  return validationErrors
}

export function flattenValidationErrors(
  validationErrors: ValidationError[]
): string[] {
  return validationErrors
    .flatMap((error) => mapChildrenToValidationErrors(error))
    .filter((item: ValidationError) => !!item.constraints)
    .flatMap((item: ValidationError) => Object.values(item.constraints ?? {}))
}
