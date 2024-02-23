import { HttpException } from "./http.exception"
import { HttpStatus } from ".."

/**
 * UnprocessableEntityException
 *
 * Exception for 422 HTTP error
 *
 * @class UnprocessableEntityException
 * @extends {HttpException}
 * @example
 * throw new UnprocessableEntityException("Unprocessable Entity")
 * throw new UnprocessableEntityException("Unprocessable Entity", ["error1", "error2"])
 */
export class UnprocessableEntityException extends HttpException {
  public name = "UnprocessableEntityException"

  public constructor(
    message: string = "Unprocessable Entity",
    errors?: string[]
  ) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, message, errors)
  }
}
