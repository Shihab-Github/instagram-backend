import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const { caption, imageUrl, authorId } = createPostDto;
    const newPost = this.prisma.post.create({
      data: {
        caption,
        imageUrl,
        author: {
          connect: { id: authorId },
        },
      },
    });

    await this.cacheManager.del('all_posts_feed');
    return newPost;
  }

  async findAll() {
    const cacheKey = 'all_posts_feed';

    const cachedPost = await this.cacheManager.get(cacheKey);
    if (cachedPost) {
      console.log('⚡ [REDIS CACHE HIT] Fetching feed from memory...');
      return cachedPost;
    }

    const posts = this.prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await this.cacheManager.set(cacheKey, posts, 60000);
    return posts;
  }

  async findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: string) {
    const deleted = this.prisma.post.delete({
      where: {
        id,
      },
    });

    await this.cacheManager.del('all_posts_feed');
    return deleted;
  }
}
