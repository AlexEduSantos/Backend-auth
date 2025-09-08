// src/auth/session.serializer.ts
import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private prisma: PrismaService) {
    super();
  }

  // Corrigimos o tipo do 'err' para aceitar null ou Error
  serializeUser(user: any, done: (err: Error | null, user: any) => void): any {
    done(null, user.id);
  }

  // Corrigimos o tipo do 'err' para aceitar null ou Error
  async deserializeUser(
    payload: any,
    done: (err: Error | null, payload: any) => void,
  ): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id: payload } });
    if (!user) {
      // Quando não encontrar o usuário, passamos null para o user
      done(null, null);
    } else {
      done(null, user);
    }
  }
}
