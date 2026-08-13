import {Injectable} from '@nestjs/common';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const { caption, imageUrl, authorId } = createPostDto
    return this.prisma.post.create({
      data: {
        caption,
        imageUrl,
        author: {
          connect: {id: authorId}
        }
      }
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: {
        author: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true
      }
    })
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto
    })
  }

  async remove(id: string) {
    return this.prisma.post.delete({
      where: {
        id
      }
    })
  }
}
