import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UserObject } from '../auth/dto/user.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserObject)
  async me(@CurrentUser() user: any) {
    return this.userService.findById(user.id);
  }
}
