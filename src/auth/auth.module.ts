// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SessionSerializer } from './session.serializer';
import { SessionGuard } from './session.guard';
@Module({
  imports: [PassportModule.register({ session: true }), PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer, SessionGuard],
})
export class AuthModule {}
