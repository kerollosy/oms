import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCartDto {
  @ApiProperty({ description: 'The ID of the user' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'The ID of the product' })
  @IsInt()
  productId: number;

  @ApiProperty({ description: 'The quantity of the product' })
  @IsPositive()
  quantity: number;
}
