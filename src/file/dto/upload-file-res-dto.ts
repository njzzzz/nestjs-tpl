import { ApiProperty } from '@nestjs/swagger'

export class updateFileResDto {
  @ApiProperty({
    description: '资源地址',
  })
    url: string
}
