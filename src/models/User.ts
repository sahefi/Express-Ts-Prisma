// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an ' + 
  'object with the appropriate user keys.';

export enum UserRoles {
  Standard,
  Admin,
}


// **** Types **** //

export interface IUser {
  id: number;
  name: string;
  email: string;
  pwdHash?: string;
  role?: UserRoles;
}

export interface ICreateUser{
  name: string;
  age: number;
}

export interface IFilterList{
  name: string;
  age: number;
}

export interface IUpdateUser{
  id: string;
  name: string;
  age: number;
}

export interface IDeleteUser{
 id: string;
}

export interface ISessionUser {
  id: number;
  email: string;
  name: string;
  role: IUser['role'];
}

export interface IAddGame {
  name : string;
}

export interface IAssigneGame {
  user_id:string;
  id : string
}

export interface IRespGame {
  id_game:string
  name_game:string
}

export interface IRespListUserGame {
  name_user:string
  game:IRespGame[]
}

export interface IReqFilter{
  name_user?:string
  name_game?:string
}
export interface IAssignedCategory{
  category_id:string;
  id : string
}

export interface IRegister{
  username : string;
  password : string;
  name : string;
  age : number;
}

export interface ILogin{
  username : string;
  password : string;
}


// **** Functions **** //

/**
 * Create new User.
 */
function new_(
  name?: string,
  email?: string,
  role?: UserRoles,
  pwdHash?: string,
  id?: number, // id last cause usually set by db
): IUser {
  return {
    id: (id ?? -1),
    name: (name ?? ''),
    email: (email ?? ''),
    role: (role ?? UserRoles.Standard),
    pwdHash: (pwdHash ?? ''),
  };
}

/**
 * Get user instance from object.
 */
function from(param: object): IUser {
  // Check is user
  if (!isUser(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  // Get user instance
  const p = param as IUser;
  return new_(p.name, p.email, p.role, p.pwdHash, p.id);
}

/**
 * See if the param meets criteria to be a user.
 */
function isUser(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'id' in arg &&
    'email' in arg &&
    'name' in arg &&
    'role' in arg
  );
}


// **** Export default **** //

export default {
  new: new_,
  from,
  isUser,
} as const;
