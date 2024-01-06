import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default (configService: ConfigService): JwtSignOptions => ({
  secret: configService.get('REFRESH_SIGN'),
  expiresIn: configService.get('REFRESH_TIMELIFE'),
});
