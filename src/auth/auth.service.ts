import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * It takes a RegisterUserDto object, hashes the password, checks if the user already exists, and if
   * not, creates a new user
   * @param {RegisterUserDto} regUser - RegisterUserDto - this is the object that is passed in from the
   * controller.
   * @returns The created user is being returned.
   */
  async registerUser(regUser: RegisterUserDto): Promise<User> {
    const { username, email, password, firstName, lastName } = regUser;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const toCreate = this.authRepository.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const foundUser = await this.authRepository.findOne({
      select: ['username', 'email'],
      where: [{ username }, { email }],
    });
    if (foundUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    try {
      const createdUser = await this.authRepository.save(toCreate);
      delete createdUser.id;
      delete createdUser.username;
      delete createdUser.password;
      delete createdUser.createdAt;
      delete createdUser.updatedAt;
      return createdUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  /**
   * It takes a LoginUserDto object, finds the user by email, compares the password, and if the user
   * exists and the password matches, it returns an access token
   * @param {LoginUserDto} loginUser - LoginUserDto - This is the DTO that we created earlier.
   * @returns { accessToken: string }
   */
  async loginUser(loginUser: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUser;

    const user = await this.usersService.findByEmail(email);

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && (await isMatch)) {
      const payload: JwtPayload = { id: user.id, email: user.email };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    }
    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}
