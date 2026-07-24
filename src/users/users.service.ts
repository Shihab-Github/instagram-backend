import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService} from "../prisma/prisma.service";


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create(createUserDto);
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: { posts: true }
    })
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { posts: true }
    })
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
