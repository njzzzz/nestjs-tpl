import { ApiProperty } from '@nestjs/swagger'

export class responseDto<T> {
  @ApiProperty({
    description: '接口返回信息',
  })
  message: string

  @ApiProperty({
    description: '状态, 200为成功， 401为未登陆',
  })
  statusCode: number

  @ApiProperty({
    description: '接口返回数据',
  })
  data: T
}
