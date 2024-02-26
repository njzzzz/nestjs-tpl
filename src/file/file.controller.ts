import { extname } from 'node:path'
import { randomUUID } from 'node:crypto'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { JwtGuard } from '../guards/jwt/jwt.guard'
import { FileService } from './file.service'
import { UploadFileDto } from './dto/upload-file.dto'
import { UploadFilesDto } from './dto/upload-files.dto'

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '文件上传' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '文件',
    type: UploadFileDto,
  })
  @UseGuards(JwtGuard)
  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/upload/',
        filename: (req, file, callback) => {
          const ext = extname(file.originalname)
          callback(null, randomUUID() + ext)
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File): { url: string } {
    return {
      url: `/upload/${file.filename}`,
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '多文件上传' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '多个文件',
    type: UploadFilesDto,
  })
  @UseGuards(JwtGuard)
  @Post('/uploads')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './public/upload/',
        filename: (req, file, callback) => {
          const ext = extname(file.originalname)
          callback(null, randomUUID() + ext)
        },
      }),
    }),
  )
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]): {
    url: string[]
  } {
    return {
      url: files.map(file => `/upload/${file.filename}`),
    }
  }
}
