import { Controller, Get, Inject, LoggerService } from '@nestjs/common';
import { AppService } from './app.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CloudTasksClient } from '@google-cloud/tasks';
import { credentials } from '@grpc/grpc-js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService,) { }

  @Get("/posts")
  getPosts() {
    return this.appService.getPosts();
  }

  @Get("/")
  getHello(): string {
    console.log("hello, world !!!!!")
    return this.appService.getHello();
  }

  // タスクを処理するハンドラのエンドポイント
  @Get("/handler")
  handler(): string {
    console.log("タスクに呼び出された")
    return "done tasks";
  }

  // タスクを作成するエンドポイント
  @Get("/tasks")
  async tasks(): Promise<string> {

    const client = new CloudTasksClient({
      port: 8123,
      servicePath: 'localhost',
      sslCreds: credentials.createInsecure(),
    });

    const parent = 'projects/my-sandbox/locations/us-central1';
    const queueName = `${parent}/queues/test`;

    // Check if queue already exists
    try {
      await client.getQueue({ name: queueName });
    } catch (error) {
      // If the queue does not exist, create it
      if (error.code === 5) { // 5 means 'NOT FOUND' in gRPC
        await client.createQueue({ parent, queue: { name: queueName } });
      } else {
        // If the error is something else, rethrow it
        throw error;
      }
    }

    await client.createTask({
      parent: queueName,
      // タスクを実行するエンドポイントを指定
      task: { httpRequest: { httpMethod: 'GET', url: 'http://192.168.30.94:3000/handler' } },
    });

    return "tasks";
  }
}


