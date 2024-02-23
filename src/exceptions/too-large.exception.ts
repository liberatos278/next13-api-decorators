import { HttpException } from "./http.exception"
import { HttpStatus } from ".."

/**
 * PayloadTooLargeException
 *
 * Exception for 413 HTTP error
 *
 * @class PayloadTooLargeException
 * @extends {HttpException}
 * @example
 * throw new PayloadTooLargeException("Payload Too Large")
 */
export class PayloadTooLargeException extends HttpException {
  public name = "PayloadTooLargeException"

  public constructor(message: string = "Payload Too Large", errors?: string[]) {
    super(HttpStatus.PAYLOAD_TOO_LARGE, message, errors)
  }
}
