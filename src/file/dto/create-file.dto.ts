import { ApiProperty } from '@nestjs/swagger'

export class CreateFileDto {
  @ApiProperty({
    type: 'file',
    description: '文件',
  })
  file: any
}
