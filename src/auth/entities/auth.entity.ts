import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
  @Prop({
    required: true,
  })
  ref: string;
}

export const AuthModel = SchemaFactory.createForClass(Auth);
