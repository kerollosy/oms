import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('api/orders')
@ApiTags('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiResponse({ status: 404, description: 'User or Cart not found' })
    @Post()
    async createOrder(@Body() createOrderDto: CreateOrderDto) {
        try {
            const order = await this.ordersService.createOrder(createOrderDto);
            return { status: HttpStatus.OK, order };
        } catch (error) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: error.message },
                HttpStatus.NOT_FOUND
            );
        }
    }

    @ApiOperation({ summary: 'Get order details by ID' })
    @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @Get(':orderId')
    async getOrder(@Param('orderId', ParseIntPipe) orderId: number) {
        try {
            const order = await this.ordersService.getOrder(orderId);
            return { status: HttpStatus.OK, order };
        } catch (error) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: error.message },
                HttpStatus.NOT_FOUND
            );
        }
    }

    @ApiOperation({ summary: 'Update order status' })
    @ApiResponse({ status: 200, description: 'Order status updated successfully' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @Put(':orderId/status')
    async updateStatus(@Param('orderId', ParseIntPipe) orderId: number) {
        try {
            const order = await this.ordersService.updateStatus(orderId);
            return { status: HttpStatus.OK, order };
        } catch (error) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: error.message },
                HttpStatus.NOT_FOUND
            );
        }
    }

    @ApiOperation({ summary: 'Apply a coupon to an order' })
    @ApiResponse({ status: 200, description: 'Coupon applied successfully' })
    @ApiResponse({ status: 404, description: 'Order or Coupon not found' })
    @Post('apply-coupon')
    async applyCoupon(@Body() applyCouponDto: ApplyCouponDto) {
        try {
            const order = await this.ordersService.applyCoupon(applyCouponDto);
            return { status: HttpStatus.OK, order };
        } catch (error) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: error.message },
                HttpStatus.NOT_FOUND
            );
        }
    }
}
