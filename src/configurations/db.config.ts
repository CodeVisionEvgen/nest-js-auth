import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export default (
  configService: ConfigService,
): MongooseModuleFactoryOptions => ({
  uri:
    configService.get('MONGODB_URI') +
    configService.get('MONGO_INITDB_DATABASE'),
  auth: {
    username: configService.get('MONGO_INITDB_ROOT_USERNAME'),
    password: configService.get('MONGO_INITDB_ROOT_PASSWORD'),
  },
});
