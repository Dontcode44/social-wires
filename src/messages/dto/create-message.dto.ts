import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}