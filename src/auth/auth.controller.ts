import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Response,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignupAuthDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import {
  NICK_OR_PASSWORD_WRONG,
  TOKEN_IS_NOT_EXIST,
  USER_IS_EXIST,
} from './auth.constants';
import * as bcrypt from 'bcrypt';
import { Response as ResType } from 'express';
import { SigninAuthDto } from './dto/signin.dto';
import { JsonWebTokenError } from '@nestjs/jwt';
import { VerifyTokenDto } from './dto/verify-tokens.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('/signin')
  async signin(@Body() body: SigninAuthDto, @Response() response: ResType) {
    console.log(body);
    const user = await this.userService.FindUserByNick(body.nick);

    if (!user) throw new UnauthorizedException(NICK_OR_PASSWORD_WRONG);

    const isValidPassword = await bcrypt.compare(body.password, user.password);

    if (!isValidPassword)
      throw new UnauthorizedException(NICK_OR_PASSWORD_WRONG);

    const Tokens = this.authService.CreateTokens({
      sub: user._id,
      nick: user.nick,
      email: user.email,
    });

    response.setHeader('authorization', Tokens.AccessToken);
    response.cookie('refresh', Tokens.RefreshToken, { httpOnly: true });
    response.status(201).json({ nick: user.nick, email: user.email });
  }

  @UsePipes(new ValidationPipe())
  @Post('/signup')
  async signup(@Body() body: SignupAuthDto, @Response() response: ResType) {
    const user = await this.userService.UserIsExist(body.nick, body.email);
    if (user) throw new BadRequestException(USER_IS_EXIST);

    body.password = bcrypt.hashSync(body.password, 10);

    const newUser = await this.userService.new(body);

    delete body.password;

    const tokens = this.authService.CreateTokens({
      sub: newUser._id,
      ...body,
    });

    await this.authService.SaveRefreshToken(tokens.RefreshToken);

    response.setHeader('authorization', tokens.AccessToken);
    response.cookie('refresh', tokens.RefreshToken, { httpOnly: true });
    response.status(201).json({ nick: newUser.nick, email: newUser.email });
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('verify')
  async verifyTokens(@Body() body: VerifyTokenDto) {
    const refresh = await this.authService.FindToken(body.refresh);
    if (!refresh) throw new UnauthorizedException(TOKEN_IS_NOT_EXIST);

    try {
      const authorization = await this.authService.VefifyToken(
        body.authorization,
        'access',
      );
      return authorization;
    } catch (error) {
      if (error instanceof JsonWebTokenError) throw new UnauthorizedException();
      else throw new BadGatewayException();
    }
  }
}
