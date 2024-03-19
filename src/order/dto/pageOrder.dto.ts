import { ApiProperty, OmitType } from '@nestjs/swagger'
import { createPaginationDto } from 'src/common/paginationEntity'
import { GetOrderDto } from './getOrder.dto'

export class PageOrderDto extends GetOrderDto {
  @ApiProperty({
    description: '创建时间-开始时间',
  })
  startTime: string

  @ApiProperty({
    description: '创建时间-结束时间',
  })
  endTime: string
}
export const PaginationOrderDto = createPaginationDto(GetOrderDto)
