import { Body, Controller, Get, HttpException, HttpStatus, Post, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiOperation({ summary: "Create a new User" })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: "User couldn't be created" })
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
        try {
            const user = await this.usersService.createUser(createUserDto);
            return { status: HttpStatus.OK, user };
        } catch (error) {
            throw new HttpException(
                { status: HttpStatus.BAD_REQUEST, error: error.message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @ApiOperation({ summary: "Retrieves a user's info" })
    @ApiResponse({ status: 200, description: 'User info retrieved successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Get(':userId')
    async getUser(@Param('userId', ParseIntPipe) userId: number): Promise<any> {
        try {
            const user = await this.usersService.getUser(userId);
            return { status: HttpStatus.OK, user };
        } catch (error) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: error.message },
                HttpStatus.NOT_FOUND
            );
        }
    }

    @ApiOperation({ summary: 'Retrieve order history for a user' })
    @ApiResponse({ status: 200, description: 'Order history retrieved successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Get(':userId/orders')
    async getOrderHistory(@Param('userId', ParseIntPipe) userId: number) {
        try {
            const orders = await this.usersService.getOrderHistory(userId);
            return { status: HttpStatus.OK, orders };
        } catch (error) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: error.message },
                HttpStatus.NOT_FOUND
            );
        }
    }
}
