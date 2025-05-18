// src/modules/auth/dto/signup.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignupInput {
  @Field() email: string;
  @Field() password: string;
}
