import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 20, {
    message: 'Firstname must be between 8 and 20 characters',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 20, {
    message: 'Lastname must be between 8 and 20 characters',
  })
  lastName: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
