import { HttpException, Injectable } from '@nestjs/common';
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

  /**
   * "Search for messages by author name."
   *
   * The function takes two parameters: userId and author. The userId is the id of the user who is
   * logged in. The author is the name of the author we want to search for
   * @param {string} userId - The userId of the user who is logged in.
   * @param {string} author - string - the author's name
   * @returns An array of messages
   */
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

  /**
   * "Get all messages where the user's first name contains the given author string."
   *
   * The first thing we do is create a query builder. This is a special object that allows us to build
   * up a query using methods, rather than writing raw SQL
   * @param {string} author - string - the author's name
   * @returns An array of messages
   */
  async getAllMessagesAuthors(author: string): Promise<Message[]> {
    const query = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.user', 'user')
      .where('user.firstName ILIKE :author', { author: `%${author}%` })
      .getMany();

    return query;
  }

  /**
   * It returns a list of messages from the database, ordered by date in ascending order, for a given
   * user
   * @param {string} userId - string - the userId of the user we want to get messages for
   * @returns An array of messages
   */
  async getByDateAsc(userId: string): Promise<Message[]> {
    const query = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('message.createdAt', 'ASC')
      .getMany();

    return query;
  }

  /**
   * We're using the `preload` method to find a message that matches the userId and the messageId. If
   * we find a message, we update it and save it. If we don't find a message, we throw a 404 error
   * @param {string} userId - The id of the user who created the message.
   * @param {CreateMessageDto} edit - CreateMessageDto
   * @returns The updated message
   */
  async updateMessageCurrentUserId(
    userId: string,
    edit: CreateMessageDto,
  ): Promise<any> {
    const userFound = await this.usersService.findById(userId);
    const idFound = userFound.id;

    const messageFound = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.user', 'user')
      .where('user.id = :idFound', { idFound })
      .update(Message)
      .set({ ...edit })
      .execute();

    return messageFound;
  }
}
