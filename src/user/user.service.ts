import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = data.username;
    user.password = data.password;
    return await this.usersRepository.save(user);
  }

  async login(data: LoginUserDto): Promise<User> {
    return await this.usersRepository.findOneBy(data);
  }
  // 事务，创建多个用户
  async createMany(users: User[]) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(users[0]);
      await queryRunner.manager.save(users[1]);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
