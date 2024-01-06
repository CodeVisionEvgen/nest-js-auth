import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default (configService: ConfigService): JwtSignOptions => ({
  secret: configService.get('ACCESS_SIGN'),
  expiresIn: configService.get('ACCESS_TIMELIFE'),
});
