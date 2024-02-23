import { HttpException } from "./http.exception"
import { HttpStatus } from ".."

/**
 * ForbiddenException
 *
 * Exception for 403 HTTP error
 *
 * @class ForbiddenException
 * @extends {HttpException}
 * @example
 * throw new ForbiddenException("Forbidden")
 */
export class ForbiddenException extends HttpException {
  public name = "ForbiddenException"

  public constructor(message: string = "Forbidden") {
    super(HttpStatus.FORBIDDEN, message)
  }
}
