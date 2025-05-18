import { ObjectType, Field } from '@nestjs/graphql';
import { UserObject } from './user.type';

@ObjectType()
export class AuthResponse {
  @Field() accessToken: string;
  @Field() refreshToken: string;

  @Field(() => UserObject)
  user: UserObject;
}
