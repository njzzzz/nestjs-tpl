import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { paginate } from 'prisma-extension-pagination'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  pg() {
    return this.$extends({
      model: {
        $allModels: {
          paginate,
        },
      },
    })
  }

  async onModuleInit() {
    await this.$connect()
  }
}
