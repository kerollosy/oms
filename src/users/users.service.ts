import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async createUser(createUserDto: CreateUserDto) {
        const { name, email, password, address } = createUserDto;

        const user = await this.prisma.user.findUnique({
            where: { email }
        });
        if(user) throw new BadRequestException('User with this email already exists');

        return await this.prisma.user.create({
            data: { name, email, password, address }
        });
    }

    async getUser(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { userId }
        });
        if(!user) throw new BadRequestException('User not found');

        return user;
    }
}
