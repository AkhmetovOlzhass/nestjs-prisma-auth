import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserObject {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  emailConfirmed: boolean;

  @Field()
  createdAt: Date;
}
