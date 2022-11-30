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

  /**
   * It finds a user by id and if it doesn't exist, it throws an error
   * @param {string} id - string - The id of the user we want to find.
   * @returns The user with the id that was passed in.
   */
  async findById(id: string): Promise<User> {
    const foundId = this.usersRepository.findOne({ where: { id } });
    if (!foundId) {
      throw new HttpException('Not exist', HttpStatus.NOT_FOUND);
    }
    return foundId;
  }

  /**
   * It returns a promise of an array of users, and it takes a userId as a parameter
   * @param {string} userId - string
   * @returns An array of users
   */
  async getAllUsers(userId: string): Promise<User[]> {
    const foundAll = this.usersRepository.find({
      where: {
        id: userId,
      },
    });
    return foundAll;
  }
}

