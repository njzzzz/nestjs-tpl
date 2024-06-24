import { ApiProperty } from '@nestjs/swagger'

class PaginationDto {
  @ApiProperty({
    description: '是否是第一页',
  })
  isFirstPage: boolean

  @ApiProperty({
    description: '是否是最后一页',
  })
  @ApiProperty()
  isLastPage: boolean

  @ApiProperty({
    description: '当前页',
  })
  currentPage: number

  @ApiProperty({
    description: '前一页',
  })
  previousPage: number

  @ApiProperty({
    description: '后一页',
  })
  nextPage: number

  @ApiProperty({
    description: '总页数',
  })
  pageCount: number

  @ApiProperty({
    description: '总数量',
  })
  totalCount: number
}

export function createPaginationDto<T>(Item: T) {
  class PaginationResponseDto<T> {
    @ApiProperty({ type: Item, isArray: true })
  list: T[]

    @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto
  }
  return PaginationResponseDto
}
