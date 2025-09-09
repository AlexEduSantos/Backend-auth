import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { Request as ExpressRequest } from 'express';
import { SessionGuard } from './session.guard';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: ExpressRequest, @Body() loginDto: LoginDto) {
    return new Promise((resolve, reject) => {
      req.login(req.user as User, (err: Error) => {
        if (err) {
          return reject(err);
        }
        req.session.save((err: Error) => {
          if (err) {
            return reject(err);
          }
          resolve(req.user);
        });
      });
    });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return new Promise((resolve, reject) => {
      req.logout((err: Error) => {
        if (err) {
          return reject(err);
        }
        // Retorna uma resposta de sucesso após o logout
        resolve({ message: 'Logout bem-sucedido.' });
      });
    });
  }

  @UseGuards(SessionGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
