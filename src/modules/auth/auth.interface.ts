export interface TLoginUser {
  email: string;
  password?: string;
}

export interface TRegisterUser extends TLoginUser {
  name: string;
  photo?: string;
}