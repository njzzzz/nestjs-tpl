import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, PartialType } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { JwtGuard } from 'src/guards/jwt/jwt.guard'
import { JwtPayload } from 'src/auth/jwtPayload.interface'
import { OrderService } from './order.service'
import { CreateOrderDto } from './dto/createOrder.dto'
import { UpdateOrderDto } from './dto/updateOrder.dto'
import { PageOrderDto, PaginationOrderDto } from './dto/pageOrder.dto'
import { GetOrderDto } from './dto/getOrder.dto'

@ApiTags('Order')
@Controller('order')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: '创建订单' })
  @ApiBody({
    description: '创建订单',
    type: CreateOrderDto,
  })
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: { user: JwtPayload }) {
    return await this.orderService.create({
      ...createOrderDto,
      user: {
        connect: { id: req.user.id },
      },
    })
  }

  @ApiOperation({ summary: '获取所有订单列表' })
  @ApiResponse({
    type: PaginationOrderDto,
  })
  @Get('/list/all')
  async findAll(@Req() req: { user: JwtPayload }) {
    return await this.orderService.findAll({ where: { userId: req.user.userId } })
  }

  @ApiOperation({ summary: '分页获取订单列表' })
  @ApiParam({
    name: 'page',
    description: '页码',
    required: true,
  })
  @ApiParam({
    name: 'limit',
    description: '每页数量',
    required: true,
  })
  @ApiBody({
    required: false,
    type: PartialType(PageOrderDto),
  })
  @ApiResponse({
    type: PaginationOrderDto,
  })
  @Post('/list/page/:page/:limit')
  async page(
    @Param('page', ParseIntPipe) page: number,
    @Param('limit', ParseIntPipe) limit: number,
    @Body() body: Partial<PageOrderDto> = {},
    @Req() req: { user: JwtPayload },
  ) {
    const { startTime, endTime, ...query } = body
    const createdAt: Prisma.DateTimeNullableFilter<'Order'> = {}
    if (startTime)
      createdAt.gte = new Date(startTime).toISOString()
    if (endTime)
      createdAt.lte = new Date(endTime).toISOString()
    return await this.orderService.page({ page, limit }, {
      ...query,
      createdAt,
      userId: req.user.userId,
    })
  }

  @ApiOperation({ summary: '根据id查询订单' })
  @ApiParam({
    name: 'orderId',
    description: '订单id',
    required: true,
  })
  @ApiResponse({
    type: GetOrderDto,
  })
  @Get(':orderId')
  async findOne(@Param('orderId') orderId: string, @Req() req: { user: JwtPayload }) {
    return await this.orderService.findOne({ orderId, userId: req.user.userId })
  }

  @ApiOperation({ summary: '根据id完成订单' })
  @ApiParam({
    name: 'orderId',
    description: '订单id',
    required: true,
  })
  @ApiResponse({
    type: GetOrderDto,
  })
  @Post('/done/:orderId')
  async done(@Param('orderId') orderId: string, @Req() req: { user: JwtPayload }) {
    return await this.orderService.done({ orderId, userId: req.user.userId })
  }

  @ApiOperation({ summary: '根据id更新订单' })
  @ApiParam({
    name: 'orderId',
    description: '订单id',
    required: true,
  })
  @ApiBody({
    description: '更新订单',
    type: UpdateOrderDto,
  })
  @ApiResponse({
    type: GetOrderDto,
  })
  @Patch(':orderId')
  async update(@Param('orderId') orderId: string, @Body() body: Prisma.OrderUpdateInput, @Req() req: { user: JwtPayload }) {
    return await this.orderService.update({ orderId, userId: req.user.userId }, body)
  }

  @ApiOperation({ summary: '删除订单' })
  @ApiParam({
    name: 'orderId',
    description: '订单id',
    required: true,
  })
  @ApiResponse({
    type: GetOrderDto,
  })
  @Delete(':orderId')
  async remove(@Param('orderId') orderId: string, @Req() req: { user: JwtPayload }) {
    return await this.orderService.remove({ orderId, userId: req.user.userId })
  }
}
