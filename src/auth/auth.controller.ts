import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Response,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignupAuthDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { USER_IS_EXIST } from './auth.constants';
import * as bcrypt from 'bcrypt';
import { Response as ResType } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('/signup')
  async signup(@Body() body: SignupAuthDto, @Response() response: ResType) {
    const user = await this.userService.UserIsExist(body.nick, body.email);
    if (user) throw new BadRequestException(USER_IS_EXIST);

    body.password = bcrypt.hashSync(body.password, 10);

    const newUser = await this.userService.new(body);

    delete body.password;

    console.log(body);

    const tokens = this.authService.CreateTokens({
      sub: newUser._id,
      ...body,
    });

    await this.authService.SaveRefreshToken(tokens.RefreshToken);

    response.setHeader('authorization', tokens.AccessToken);
    response.cookie('refresh', tokens.RefreshToken, { httpOnly: true });
    response.status(201).json({ nick: newUser.nick, email: newUser.email });
  }
}
