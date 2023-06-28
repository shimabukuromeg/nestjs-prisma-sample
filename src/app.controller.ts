import { Controller, Get, Post, Body, Inject, LoggerService, Headers, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TasksPublisherService, PublishOptions } from "@anchan828/nest-cloud-run-queue-tasks-publisher";
import { QueueWorkerReceivedMessage, QueueWorkerService } from "@anchan828/nest-cloud-run-queue-worker";
import { BasicAuthGuard } from './auth/guard/basic-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly tasksService: TasksPublisherService,
    private readonly service: QueueWorkerService
  ) { }

  @Get("/posts")
  getPosts() {
    return this.appService.getPosts();
  }

  @Get()
  @UseGuards(BasicAuthGuard)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/tasks")
  public async publishTasksMessage(): Promise<string> {
    console.log("タスクを送信します")

    const options: PublishOptions = {
      httpRequest: {
        httpMethod: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.BASIC_AUTH_USERNAME}:${process.env.BASIC_AUTH_PASSWORD}`, 'ascii').toString('base64')}`,
        },
      },
    }

    return this.tasksService.publish({ data: "message", name: "tasks2" }, options);
  }

  @Post("/execute")
  @UseGuards(BasicAuthGuard)
  public async execute(
    @Body() body: QueueWorkerReceivedMessage,
    @Headers() headers: Record<string, string>,
  ): Promise<void> {
    console.log("[コントローラー] タスクを受け取りました");
    await this.service.execute({ ...body.message, headers });
  }
}
