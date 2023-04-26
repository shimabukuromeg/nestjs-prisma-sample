import { Controller, Get, Inject, LoggerService } from '@nestjs/common';
import { AppService } from './app.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService,) { }

  @Get("/posts")
  getPosts() {
    this.logger.log("/posts にアクセスされました。")

    this.logger.error(new Error('logger.error: error message'))
    console.error(new Error('console.error: error message'))

    return this.appService.getPosts();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
