import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveCartDto } from './dto/remove-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) { }

  private async findUserById(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} does not exist.`);
    }
    return user;
  }

  private async findProductById(productId: number) {
    const product = await this.prisma.product.findUnique({ where: { productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} does not exist.`);
    }
    return product;
  }

  async addToCart(addCartDto: AddCartDto) {
    const { userId, productId, quantity } = addCartDto;

    await this.findUserById(userId);
    await this.findProductById(productId);

    // Find the user's cart or create a new one if it doesn't exist
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: { CartItem: true }
    });

    if (!cart) {
      await this.prisma.cart.create({
        data: {
          userId,
          CartItem: {
            create: [{ productId, quantity }]
          }
        }
      });
    } else {
      const cartItem = cart.CartItem.find((item) => item.productId === productId);

      if (cartItem) {
        // The user already has this product in his cart so we increment the quantity
        await this.prisma.cartItem.update({
          where: { cartItemId: cartItem.cartItemId },
          data: { quantity: cartItem.quantity + quantity }
        });
      } else {
        // The user doesn't have this product in his cart so we add it
        await this.prisma.cartItem.create({
          data: {
            cartId: cart.cartId,
            productId,
            quantity
          }
        });
      }
    }

    return { message: "Product added to cart" }
  }

  async viewCart(userId: number) {
    await this.findUserById(userId);

    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        CartItem: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!cart) {
      throw new NotFoundException(`User doesn't have any items in the cart`);
    }

    return cart;
  }

  async updateCartItem(updateCartDto: UpdateCartDto) {
    const { userId, productId, quantity } = updateCartDto;

    await this.findUserById(userId);
    await this.findProductById(productId);

    const cart = await this.prisma.cart.findFirst({ where: { userId }, include: { CartItem: true } });
    if (!cart) throw new NotFoundException("User doesn't have any items in the cart");

    const cartItem = cart.CartItem.find((item) => item.productId === productId);
    if (!cartItem) throw new NotFoundException(`Product with ID ${productId} not found in cart`);

    await this.prisma.cartItem.update({
      where: { cartItemId: cartItem.cartItemId },
      data: { quantity }
    });

    return { message: 'Cart updated' };
  }

  async removeFromCart(removeCartDto: RemoveCartDto) {
    const { userId, productId } = removeCartDto;

    await this.findUserById(userId);
    await this.findProductById(productId);

    const cart = await this.prisma.cart.findFirst({ where: { userId }, include: { CartItem: true } });
    if (!cart) throw new NotFoundException("User doesn't have any items in the cart");

    const cartItem = cart.CartItem.find((item) => item.productId === productId);
    if (!cartItem) throw new NotFoundException(`Product with ID ${productId} not found in cart`);

    await this.prisma.cartItem.delete({
      where: { cartItemId: cartItem.cartItemId }
    });

    return { message: 'Product removed from cart' };
  }
}
