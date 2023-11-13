/**
 * Miscellaneous shared classes go here.
 */

import HttpStatusCodes from '@src/constants/HttpStatusCodes';


/**
 * Error with status code and message
 */
export class RouteError extends Error {

  public status: HttpStatusCodes;

  public constructor(status: HttpStatusCodes, message: string) {
    super(message);
    this.status = status;
  }
}

export class BadRequestExcepetion extends Error {
  
  public status: HttpStatusCodes;

  public constructor(message:string){
      super(message);
      this.status = HttpStatusCodes.BAD_REQUEST
  }
}

export class NotFoundException extends Error {

  public status: HttpStatusCodes;

  public constructor(message:string){
      super(message)
      this.status = HttpStatusCodes.NOT_FOUND
  }
}

export class ConflictException extends Error {
  public status: HttpStatusCodes;

  public constructor(message:string){
    super(message)
    this.status = HttpStatusCodes.CONFLICT
  }
}

export class ForbiddenException extends Error {
  public status: HttpStatusCodes

  public constructor(message:string){
    super(message)
    this.status = HttpStatusCodes.FORBIDDEN
  }
}

export class UnauthorizedException extends Error {
  public status : HttpStatusCodes

  public constructor(message:string){
    super(message)
    this.status = HttpStatusCodes.UNAUTHORIZED
  }
}

// export class 
