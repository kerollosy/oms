import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [CartModule, UsersModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
