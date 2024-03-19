import { ApiProperty } from '@nestjs/swagger'
import { OrderType } from '@prisma/client'
import { IsNotEmpty } from 'class-validator'

export class CreateOrderDto {
  @ApiProperty({
    description: '客户名称',
  })
  @IsNotEmpty({ message: '客户名称不能为空' })
  name: string

  @ApiProperty({
    description: '客户联系方式',
  })
  @IsNotEmpty({ message: '客户联系方式不能为空' })
  phone: string

  @ApiProperty({
    description: '需求描述',
  })
  @IsNotEmpty({ message: '需求描述不能为空' })
  requirement: string

  @ApiProperty({
    description: '客户类型',
  })
  @IsNotEmpty({ message: '客户类型不能为空' })
  type: OrderType

  @ApiProperty({
    description: '客户类型描述',
  })
  typeDesc?: string

  @ApiProperty({
    description: '是否已完成',
  })
  isComplete?: boolean

  @ApiProperty({
    description: '创建时间',
  })
  createdAt?: Date

  @ApiProperty({
    description: '更新时间',
  })
  updatedAt?: Date
}
