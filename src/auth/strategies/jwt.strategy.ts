import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { JwtPayload } from '../jwt/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * The constructor function is used to inject the User repository into the class
   * @param userRepo - Repository<User> - This is the repository that we will use to find the user in
   * the database.
   */
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    /* Calling the super class constructor and passing in the options object. */
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  /**
   * It takes a JwtPayload object as an argument, and returns a Promise of an array of User objects
   * @param {JwtPayload} payload - JwtPayload
   * @returns The user object
   */
  async validate(payload: JwtPayload): Promise<User[]> {
    const { email } = payload;
    const user = this.userRepo.findBy({ email });

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.NOT_ACCEPTABLE);
    }
    return user;
  }
}