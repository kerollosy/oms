import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveCartDto } from './dto/remove-cart.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller("api/cart")
@ApiTags('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    // Adds a product to the user's cart or updates the quantity if the product is already in the cart.
    @ApiOperation({ summary: 'Add a product to the cart' })
    @ApiResponse({ status: 201, description: 'Product added to cart' })
    @ApiResponse({ status: 404, description: 'User or Product not found' })
    @Post('add')
    async addToCart(@Body() addCartDto: AddCartDto): Promise<any> {
        try {
            const res = await this.cartService.addToCart(addCartDto);
            return { status: HttpStatus.OK, message: res.message };
        } catch (error) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: error.message },
                HttpStatus.NOT_FOUND
            );
        }
    }

    @ApiOperation({ summary: "Retrieves the user's cart" })
    @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
    @ApiResponse({ status: 404, description: 'User or Cart not found' })
    @Get(':userId')
    async viewCart(@Param('userId', ParseIntPipe) userId: number): Promise<any> {
        try {
            const cart = await this.cartService.viewCart(userId);
            return { status: HttpStatus.OK, cart };
        } catch (error) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: error.message },
                HttpStatus.NOT_FOUND
            );
        }
    }

    @ApiOperation({ summary: "Update the quantity of a product in the cart" })
    @ApiResponse({ status: 200, description: 'Cart updated' })
    @ApiResponse({ status: 404, description: 'Product not found in cart' })
    @Put('update')
    async updateCart(@Body() updateCartDto: UpdateCartDto): Promise<any> {
        try {
            const res = await this.cartService.updateCartItem(updateCartDto);
            return { status: HttpStatus.OK, message: res.message };
        } catch (error) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: error.message },
                HttpStatus.NOT_FOUND
            )
        }
    }

    @ApiOperation({ summary: 'Remove a product from the cart' })
    @ApiResponse({ status: 200, description: 'Product removed from cart' })
    @ApiResponse({ status: 404, description: 'Product not found in cart' })
    @Delete('remove')
    async removeFromCart(@Body() removeCartDto: RemoveCartDto): Promise<any> {
        try {
            const res = await this.cartService.removeFromCart(removeCartDto);
            return { status: HttpStatus.OK, message: res.message };
        } catch (error) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: error.message },
                HttpStatus.NOT_FOUND
            )
        }
    }
}
