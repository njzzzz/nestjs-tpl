import { ApiProperty } from '@nestjs/swagger'

export class UploadFileDto {
  @ApiProperty({
    type: 'file',
    description: '文件',
  })
  file: any
}
