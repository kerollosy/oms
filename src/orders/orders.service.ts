import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async createOrder(createOrderDto: CreateOrderDto) {
        const { userId } = createOrderDto;

        // Check if the user exists
        const user = await this.prisma.user.findUnique({ where: { userId } });
        if (!user) throw new NotFoundException(`User with ID ${userId} not found`)

        // Get the user's cart
        const cart = await this.prisma.cart.findFirst({
            where: { userId },
            include: { CartItem: { include: { product: true } } },
        });
        if (!cart || cart.CartItem.length === 0) throw new Error(`No items found in cart for user ID ${userId}`);

        const totalPrice = cart.CartItem.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        
        // Create the order and order items
        const order = await this.prisma.order.create({
            data: {
                userId,
                status: 'PENDING',
                OrderItem: {
                    create: cart.CartItem.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price
                    }))
                },
                totalPrice
            }
        })

        // Clear the user's cart
        await this.prisma.cartItem.deleteMany({ where: { cartId: cart.cartId } });

        return order;
    }

    async getOrder(orderId: number) {
        const order = await this.prisma.order.findUnique({
            where: { orderId },
            include: { OrderItem: true }
        });
        if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`);

        return order;
    }

    async updateStatus(orderId: number) {
        const order = await this.prisma.order.findUnique({ where: { orderId } });
        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }

        return await this.prisma.order.update({
            where: { orderId },
            data: { status: 'COMPLETED' }
        });
    }

    async applyCoupon(applyCouponDto: ApplyCouponDto) {
        const { orderId, couponCode } = applyCouponDto;

        const order = await this.prisma.order.findUnique({
            where: { orderId },
            include: { OrderItem: { include: { product: true } } },
        });
        if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`);

        const discount = this.calculateDiscount(couponCode);

        if (!discount) {
            throw new BadRequestException(`Invalid coupon code: ${couponCode}`);
        }

        const discountedPrice = order.totalPrice - discount;

        return await this.prisma.order.update({
            where: { orderId },
            data: { totalPrice: discountedPrice },
        });
    }

    private calculateDiscount(couponCode: string): number {
        const validCoupons = {
            'SLASH': 10,
        };

        return validCoupons[couponCode] || 0;
    }
}
