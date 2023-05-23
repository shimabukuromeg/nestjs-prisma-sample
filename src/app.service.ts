import { Injectable } from '@nestjs/common';
import { PrismaService } from "./prisma.service";

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) { }

  async getPosts() {
    // post一覧取得
    return await this.prismaService.post.findMany();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
