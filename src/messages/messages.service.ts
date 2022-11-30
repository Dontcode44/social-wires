import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Like, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * We're creating a message and saving it to the database
   * @param {string} userId - The id of the user who is sending the message.
   * @param {CreateMessageDto} createMessageDto - This is the DTO that we created earlier.
   * @returns The message that was created.
   */
  async createMessage(userId: string, createMessageDto: CreateMessageDto) {
    const userFound = await this.usersService.findById(userId);

    const message = this.messagesRepository.create({
      ...createMessageDto,
    });
    message.user = userFound;
    await this.messagesRepository.save(message);
    return message;
  }

  /**
   * It returns all messages from the database that are associated with the userId passed in as a
   * parameter
   * @param {string} userId - string - the id of the user we want to get the messages for
   * @returns An array of messages
   */
  async getAllMessages(userId: string): Promise<Message[]> {
    const query = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
    return query;
  }

  async searchAuthorMessages(
    userId: string,
    author: string,
  ): Promise<Message[]> {
    const query = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('user.firstName ILIKE :author', { author: `%${author}%` })
      .getMany();

    return query;
  }

  async getAllMessagesAuthors(author: string): Promise<Message[]> {
    const query = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.user', 'user')
      .where('user.firstName ILIKE :author', { author: `%${author}%` })
      .getMany();

    return query;
  }
}
