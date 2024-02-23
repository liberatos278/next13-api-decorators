import { HttpException } from "./http.exception"
import { HttpStatus } from ".."

/**
 * NotFoundException
 *
 * Exception for 404 HTTP error
 *
 * @class NotFoundException
 * @extends {HttpException}
 * @example
 * throw new NotFoundException("Not Found")
 * throw new NotFoundException("Not Found", ["error1", "error2"])
 */
export class NotFoundException extends HttpException {
  public name = "NotFoundException"

  public constructor(message: string = "Not Found", errors?: string[]) {
    super(HttpStatus.NOT_FOUND, message, errors)
  }
}
