export interface User {
  _id?: string;
  username: string;
  email: string;
}

export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
