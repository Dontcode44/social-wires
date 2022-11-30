import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';

@Injectable()
/* A middleware that checks if the user is the owner of the resource. */
export abstract class MiddleGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { params, user } = req;

    if (params?.id == null) {
      return true;
    }

    const userfound = await this.userService.findById(params?.id);

    return userfound.id === user.id;
  }
}
