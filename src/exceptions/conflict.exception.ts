import { HttpException } from "./http.exception"
import { HttpStatus } from ".."

/**
 * ConflictException
 *
 * Exception for 409 HTTP error
 *
 * @class ConflictException
 * @extends {HttpException}
 * @example
 * throw new ConflictException("Conflict")
 * throw new ConflictException("Conflict", ["error1", "error2"])
 */
export class ConflictException extends HttpException {
  public name = "ConflictException"

  public constructor(message: string = "Conflict") {
    super(HttpStatus.CONFLICT, message)
  }
}
