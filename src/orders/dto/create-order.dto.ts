import { IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
    @ApiProperty({ description: 'The ID of the user' })
    @IsInt()
    userId: number;
}