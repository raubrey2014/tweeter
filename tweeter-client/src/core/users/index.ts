import { DateISOString } from "../utils";

export interface CreateUserDto {
  handle: string;
  email: string;
}

export interface Handled {
  handle: string;
}

export interface User extends Handled {
  avatar: string;
  createdAt: DateISOString;
}

export interface FullUser extends User {
  email: string;
}
