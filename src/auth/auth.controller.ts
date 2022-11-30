import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Body() regUser: RegisterUserDto,
  ): Promise<RegisterUserDto> {
    return await this.authService.registerUser(regUser);
  }

  @Post('login')
  async loginUser(@Body() loginUser: User): Promise<{ accessToken: string }> {
    return await this.authService.loginUser(loginUser);
  }
}
