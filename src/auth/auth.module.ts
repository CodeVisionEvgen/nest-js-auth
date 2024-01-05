import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthModel } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      {
        name: Auth.name,
        schema: AuthModel,
      },
    ]),
  ],
})
export class AuthModule {}
