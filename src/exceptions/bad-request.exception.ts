import { HttpException } from "./http.exception"
import { HttpStatus } from ".."

/**
 * BadRequestException
 *
 * Exception for 400 HTTP error
 *
 * @class BadRequestException
 * @extends {HttpException}
 * @example
 * throw new BadRequestException("Invalid request")
 * throw new BadRequestException("Invalid request", ["error1", "error2"])
 */
export class BadRequestException extends HttpException {
  public name = "BadRequestException"

  public constructor(message: string = "Bad Request", errors?: string[]) {
    super(HttpStatus.BAD_REQUEST, message, errors)
  }
}
