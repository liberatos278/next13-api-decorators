import { NextResponse } from "next/server"
import { HttpException, HttpStatus, Headers, HttpMethod } from ".."

export function PrepareResponse(
  input: any,
  httpMethod: HttpMethod,
  headers: Headers,
  status?: HttpStatus
): NextResponse | Response {
  // Recognize universal input for response
  if (input && input.data !== undefined) {
    if (input.statusCode) status = input.statusCode
    input = input.data
  }

  // Return response if it's already a response
  if (input instanceof NextResponse) return input

  // Set default status code if not provided
  if (!status) {
    switch (httpMethod) {
      case HttpMethod.POST:
        status = HttpStatus.CREATED
        break
      case HttpMethod.DELETE:
        status = HttpStatus.NO_CONTENT
        break
      default:
        status = HttpStatus.OK
    }
  }

  // Create response based on exception
  if (input instanceof HttpException)
    return NextResponse.json(
      {
        message: input.message,
        errors: input.errors,
        statusCode: input.statusCode,
      },
      {
        status: input.statusCode,
        headers,
      }
    )

  let response: NextResponse | Response
  switch (typeof input) {
    case "undefined":
      response = new Response(null, {
        status: HttpStatus.NO_CONTENT,
        headers: {
          ...headers,
          "Content-Type": "plain/text",
        },
      })
      break
    case "object":
      response = NextResponse.json(input, {
        status,
        headers,
      })
      break
    default:
      response = new Response(input.toString(), {
        status,
        headers: {
          ...headers,
          "Content-Type": "plain/text",
        },
      })
  }

  return response
}
