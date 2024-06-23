import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class ApplyCouponDto {
  @ApiProperty({ description: 'The ID of the order' })
  @IsInt()
  orderId: number;

  @ApiProperty({ description: 'The coupon code to apply' })
  @IsString()
  couponCode: string;
}
