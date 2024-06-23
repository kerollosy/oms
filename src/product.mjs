// Run this to add products for testing purposes
// node src/product.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestProduct() {
    try {
        const product = await prisma.product.create({
            data: {
                name: 'Test Product',
                description: 'Best product ever!',
                price: 10.99,
                stock: 100
            },
        });
        console.log('Test product created:', product);
    } catch (error) {
        console.error('Error creating test product:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestProduct();