import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { AuthResponse } from './dto/auth-response.type';
import { LoginInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Throttle } from '@nestjs/throttler';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Query(() => String)
  hello(): string {
    return 'GraphQL API is working!';
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Mutation(() => Boolean)
  async signup(@Args('data') data: SignupInput) {
    await this.authService.signup(data);
    return true;
  }

  @Mutation(() => Boolean)
  async confirmEmail(@Args('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Mutation(() => AuthResponse)
  async login(@Args('data') data: LoginInput) {
    return this.authService.login(data);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Mutation(() => AuthResponse)
  async refreshToken(@Args('token') token: string) {
    return this.authService.refreshToken(token);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async logout(@CurrentUser() user: any) {
    return this.authService.logout(user.id);
  }
}
