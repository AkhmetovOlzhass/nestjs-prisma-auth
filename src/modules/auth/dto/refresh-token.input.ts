import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RefreshTokenInput {
  @Field()
  token: string;
}
