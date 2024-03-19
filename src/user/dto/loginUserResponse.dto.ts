import { ApiProperty } from '@nestjs/swagger'

export class loginUserResDto {
  @ApiProperty({
    description: 'accessToken',
  })
  accessToken: string
}
