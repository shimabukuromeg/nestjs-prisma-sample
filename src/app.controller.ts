import { Controller, Get, Inject, LoggerService } from '@nestjs/common';
import { AppService } from './app.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TasksPublisherService, PublishOptions } from "@anchan828/nest-cloud-run-queue-tasks-publisher";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService,
    private readonly tasksService: TasksPublisherService,
  ) { }

  @Get("/posts")
  getPosts() {
    return this.appService.getPosts();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/tasks")
  public async publishTasksMessage(): Promise<string> {
    console.log("タスクを送信します")

    const options: PublishOptions = process.env.NODE_ENV === "production" ? {
      httpRequest: {
        headers: {
          'Content-Type': 'text/plain', // Set content type to ensure compatibility your application's request parsing
        },
        httpMethod: 'POST',
        oidcToken: {
          serviceAccountEmail: process.env.CLOUD_TASK_SERVICE_ACCOUNT,
          audience: process.env.CLOUD_TASK_AUDIENCE,
        },
      },
    } : {}

    return this.tasksService.publish({ data: "message", name: "tasks" }, options);
  }
}
