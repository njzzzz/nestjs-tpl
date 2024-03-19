import { ApiProperty } from '@nestjs/swagger'
import { CreateOrderDto } from './createOrder.dto'

export class GetOrderDto extends CreateOrderDto {
  @ApiProperty({
    description: '订单id',
  })
  orderId: string
}
