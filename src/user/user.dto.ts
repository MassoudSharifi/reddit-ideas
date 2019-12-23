export class UserDTO {
  username: string;
  password: string;
}

export class UserRegisterDTO {
  id: string;
  username: string;
  created: Date;
  token: string;
}
