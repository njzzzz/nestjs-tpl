import { PartialType } from '@nestjs/swagger'
import { CreateOrderDto } from './createOrder.dto'

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
