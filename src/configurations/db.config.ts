import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export default (
  configService: ConfigService,
): MongooseModuleFactoryOptions => ({
  uri: configService.get('MONGODB_URI'),
  auth: {
    username: configService.get('MONGODB_USERNAME'),
    password: configService.get('MONGODB_PASSWORD'),
  },
});
