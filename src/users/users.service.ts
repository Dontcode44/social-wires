import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * It finds a user by email and if it doesn't exist, it throws an error
   * @param {string} email - string - the email of the user we want to find
   * @returns The user object
   */
  async findByEmail(email: string): Promise<User> {
    const foundEmail = this.usersRepository.findOne({ where: { email } });
    if (!foundEmail) {
      throw new HttpException('Not exist', HttpStatus.NOT_FOUND);
    }
    return foundEmail;
  }
}
