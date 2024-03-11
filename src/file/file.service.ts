import { Injectable } from '@nestjs/common'
import { UpdateFileDto } from './dto/update-file.dto'

@Injectable()
export class FileService {
  findAll() {
    return `This action returns all file`
  }

  findOne(id: number) {
    return `This action returns a #${id} file`
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return updateFileDto
  }

  remove(id: number) {
    return `This action removes a #${id} file`
  }
}
