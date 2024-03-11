import { ApiProperty } from '@nestjs/swagger'

export class UploadFilesDto {
  @ApiProperty({
    type: 'file',
    description: '文件',
    isArray: true,
  })
  files: any
}
