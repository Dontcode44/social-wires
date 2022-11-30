import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Userd } from 'src/auth/decorators/token.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MiddleGuard } from 'src/auth/guards/middle.guard';
import { User } from 'src/users/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(MiddleGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createMessage(
    @Userd() user: User,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return await this.messagesService.createMessage(user.id, createMessageDto);
  }
}
