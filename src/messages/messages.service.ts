import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
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
}
