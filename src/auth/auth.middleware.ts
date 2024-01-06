import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { JsonWebTokenError } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const RefreshToken = req.cookies.refresh;
    let AccessToken = req.headers.authorization;

    if (!AccessToken || !RefreshToken) throw new UnauthorizedException();

    AccessToken = AccessToken.split(' ')[1];

    if (!(await this.authService.FindToken(RefreshToken)))
      throw new UnauthorizedException();

    try {
      this.authService.VefifyToken(AccessToken, 'access');
      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        try {
          const decodeRefresh = this.authService.VefifyToken(
            RefreshToken,
            'refresh',
          );
          const user = await this.userService.FindUserById(decodeRefresh.sub);
          const Tokens = this.authService.CreateTokens({
            sub: user._id,
            nick: user.nick,
            email: user.email,
          });
          res.setHeader('authorization', Tokens.AccessToken);
          res.cookie('refresh', Tokens.RefreshToken);
          this.authService.UpdateRefTokenInDB(
            RefreshToken,
            Tokens.RefreshToken,
          );
          next();
        } catch (error) {
          throw new UnauthorizedException();
        }
    }
  }
}
