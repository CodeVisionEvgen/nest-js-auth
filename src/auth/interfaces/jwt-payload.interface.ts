import { Types } from 'mongoose';

export interface IJwtPayload {
  sub: Types.ObjectId;
  nick: string;
  email: string;
}
