import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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

  @UseGuards(MiddleGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllMessages(@Userd() user: User) {
    return await this.messagesService.getAllMessages(user.id);
  }

  @UseGuards(MiddleGuard)
  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchTittle(@Userd() user: User, @Query('author') author: string) {
    return await this.messagesService.searchAuthorMessages(user.id, author);
  }

  @Get('all')
  async getAllMessagesWithUser(@Query('author') author: string) {
    return await this.messagesService.getAllMessagesAuthors(author);
  }
}
