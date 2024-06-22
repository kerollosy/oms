import { IsEmail, IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'The name of the user' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The email of the user' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The password of the user' })
    @IsString()
    @Length(4, 20)
    password: string;

    @ApiProperty({ description: 'The address of the user', required: false })
    @IsString()
    @IsOptional()
    address: string;
}