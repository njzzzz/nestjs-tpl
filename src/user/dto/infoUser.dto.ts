import { ApiProperty } from '@nestjs/swagger'

export class infoUserDto {
  @ApiProperty({
    description: '用户名',
  })
  username: string
}
