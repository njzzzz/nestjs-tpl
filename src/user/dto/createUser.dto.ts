import { IsNotEmpty, Length } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @Length(4, 8)
  username: string;

  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}
