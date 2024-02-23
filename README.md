# Next.js API decorators

![Next.js](https://img.shields.io/badge/13+-blue?style=flat&label=Next.js&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fnext13-api-decorators)
![MIT License](https://img.shields.io/npm/l/next13-api-decorators?style=flat&label=License&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fnext13-api-decorators)

A library that will increase the clarity of API paths in your Next.js project. It is inspired by the well-known Nest.js framework, so it uses a number of decorators, for example to define the endpoints themselves and offers compatibility with the new app folder system that has appeared in new versions of Next.js.. This package is based on an existing package that is not compatible with the new version of Next.js [next-api-decorators](https://www.npmjs.com/package/next-api-decorators).

## Installation

Installation with npm or yarn.

```bash
  npm install next13-api-decorators
  yarn add next13-api-decorators
```

## Usage

```typescript
import {
  ApiRouteHandler,
  ValidationPipe,
  HttpStatus,
  Get,
  Post,
  Delete,
  Query,
  Body,
  Param,
} from "next13-api-decorators"
import { CreateUserDto } from "../user.dto"

class UserController extends ApiRouteHandler {
  @Get()
  getUser(@Query("name") name: string) {
    return db.users.get(name)
  }

  @Post()
  createUser(@Body(ValidationPipe) body: CreateUserDto) {
    const newUser = db.users.create(body)
    return {
      data: newUser,
      statusCode: 200,
    }
  }

  @Delete("/:userId")
  @HttpStatus(204)
  deleteUser(@Param("userId") userId: string) {
    db.user.delete(userId)
  }
}
```

## Authors

- [@liberatos278](https://github.com/liberatos278)
