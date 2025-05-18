// src/modules/auth/auth.resolver.ts
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { AuthResponse } from './dto/auth-response.type';
import { LoginInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  hello(): string {
    return 'GraphQL API is working!';
  }

  @Mutation(() => Boolean)
  async signup(@Args('data') data: SignupInput) {
    await this.authService.signup(data);
    return true;
  }

  @Mutation(() => Boolean)
  async confirmEmail(@Args('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('data') data: LoginInput) {
    return this.authService.login(data);
  }

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
