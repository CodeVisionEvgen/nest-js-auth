import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, Types } from 'mongoose';
import { SignupAuthDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async new(data: SignupAuthDto) {
    return await new this.userModel(data).save();
  }

  async UserIsExist(nick: string, email: string) {
    return await this.userModel.findOne({
      $or: [{ nick }, { email }],
    });
  }

  async FindUserById(_id: Types.ObjectId) {
    return await this.userModel.findById(_id);
  }

  async FindUserByNick(nick: string) {
    return await this.userModel.findOne({ nick });
  }
}
