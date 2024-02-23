import { NextRequest } from "next/server"
import { HttpMethod } from ".."

export type Endpoints = {
  [key in HttpMethod]?: (...args: any) => any
}

export interface QueryParameters {
  [key: string]: string
}

export interface UrlParameters extends QueryParameters {}
export interface Headers extends QueryParameters {}

export type ArgumentType = "body" | "request" | "query" | "param" | "header"

export type NextFunction = (err?: Error) => void
export type Middleware = (
  req: NextRequest,
  next: NextFunction
) => void | Promise<void>
