import { HttpException } from "./http.exception"
import { HttpStatus } from ".."

/**
 * UnauthorizedException
 *
 * Exception for 401 HTTP error
 *
 * @class UnauthorizedException
 * @extends {HttpException}
 * @example
 * throw new UnauthorizedException("Unauthorized")
 */
export class UnauthorizedException extends HttpException {
  public name = "UnauthorizedException"

  public constructor(message: string = "Unauthorized") {
    super(HttpStatus.UNAUTHORIZED, message)
  }
}
