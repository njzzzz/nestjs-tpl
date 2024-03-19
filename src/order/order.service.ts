import { Injectable } from '@nestjs/common'
import { Order, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateOrderDto } from './dto/createOrder.dto'
import { UpdateOrderDto } from './dto/updateOrder.dto'

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.OrderCreateInput) {
    return await this.prisma.order.create({ data })
  }

  async findAll(data: Prisma.OrderFindManyArgs) {
    return await this.prisma.order.findMany(data)
  }

  async page(data: { limit: number, page: number }, where: Prisma.OrderWhereInput) {
    const [list, pagination] = await this.prisma.pg().order.paginate({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    }).withPages({ includePageCount: true, ...data })
    return {
      list,
      pagination,
    }
  }

  async findOne(where: Prisma.OrderWhereInput) {
    return await this.prisma.order.findFirst({
      where,
    })
  }

  async done(where: Prisma.OrderWhereUniqueInput) {
    return await this.prisma.order.update({ where, data: { isComplete: true } })
  }

  async update(where: Prisma.OrderWhereUniqueInput, data: Prisma.OrderUpdateInput) {
    return await this.prisma.order.update({ where, data })
  }

  async remove(where: Prisma.OrderWhereUniqueInput) {
    return await this.prisma.order.delete({ where }).then(() => {
      return true
    })
  }
}
