import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user.module';
import { jwtConstant } from 'src/guards/secretkey';
import { jwtstrategy } from 'src/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { localStrategy } from 'src/strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstant.secret,
      signOptions: {expiresIn: '15m'}
    })
  ],
  providers: [AuthService,localStrategy,jwtstrategy],
  controllers: [AuthController]
})
export class AuthModule {}
