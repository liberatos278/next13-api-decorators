import { HttpException } from "./http.exception"
import { HttpStatus } from ".."

/**
 * InternalServerErrorException
 *
 * Exception for 500 HTTP error
 *
 * @class InternalServerErrorException
 * @extends {HttpException}
 * @example
 * throw new InternalServerErrorException("Internal Server Error")
 */
export class InternalServerErrorException extends HttpException {
  public name = "InternalServerErrorException"

  public constructor(message: string = "Internal Server Error") {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message)
  }
}
