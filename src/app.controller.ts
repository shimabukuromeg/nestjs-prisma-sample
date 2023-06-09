import { Controller, Get, Inject, LoggerService } from '@nestjs/common';
import { AppService } from './app.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService,) { }

  @Get("/posts")
  getPosts() {
    return this.appService.getPosts();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
