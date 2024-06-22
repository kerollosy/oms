import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveCartDto {
  @ApiProperty({ description: 'The ID of the user' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'The ID of the product' })
  @IsInt()
  productId: number;
}
