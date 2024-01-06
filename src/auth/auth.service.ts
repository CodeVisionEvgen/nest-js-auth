import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './entities/auth.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import jwtAccessConfig from 'src/configurations/jwt.access.config';
import jwtRefreshConfig from 'src/configurations/jwt.refresh.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  CreateTokens(payload: IJwtPayload) {
    const AccessToken = this.jwtService.sign(
      payload,
      jwtAccessConfig(this.configService),
    );
    const RefreshToken = this.jwtService.sign(
      { sub: payload.sub },
      jwtRefreshConfig(this.configService),
    );

    return { AccessToken, RefreshToken };
  }

  async SaveRefreshToken(token: string) {
    return await new this.authModel({ ref: token }).save();
  }

  VefifyToken(token: string, signature: 'access' | 'refresh') {
    this.jwtService.verify(token, {
      secret:
        signature === 'access'
          ? jwtAccessConfig(this.configService).secret
          : jwtRefreshConfig(this.configService).secret,
    });
    return this.jwtService.decode(token);
  }

  async UpdateRefTokenInDB(ref: string, newRef: string) {
    return await this.authModel.findOneAndUpdate(
      { ref },
      { ref: newRef },
      {
        new: true,
      },
    );
  }

  async FindToken(token: string) {
    return await this.authModel.findOne({ ref: token });
  }
}
