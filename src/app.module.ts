import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from "src/prisma.service";
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { utilities } from 'nest-winston';
import { QueueWorkerModule } from "@anchan828/nest-cloud-run-queue-worker";
import { TasksPublisherModule } from "@anchan828/nest-cloud-run-queue-tasks-publisher";
import { credentials } from "@grpc/grpc-js";
import { TasksWorker, TasksWorker2 } from "./processor";
import { AuthModule } from './auth/auth.module';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  },
];

@Module({
  imports: [
    AuthModule,
    QueueWorkerModule.register({
      workerController: null,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        level: 'info',
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              severity(),
              errorReport(),
              winston.format.timestamp(),
              configService.get('NODE_ENV') === 'production' ?
                winston.format.json() : utilities.format.nestLike(),
            ),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
    TasksPublisherModule.register({
      clientConfig: process.env.NODE_ENV === "production" ? {} : {
        apiEndpoint: "localhost",
        port: 8123,
        projectId: "test",
        sslCreds: credentials.createInsecure(),
      },
      publishConfig: {
        httpRequest: {
          url: `${process.env.WORKER_ENDPOINT}/execute`,
        },
      },
      queue: process.env.QUEUE_NAME,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, TasksWorker, TasksWorker2, ...interceptors],
})
export class AppModule { }

const severity = winston.format((info) => {
  info["severity"] = info.level.toUpperCase();
  return info;
});

const errorReport = winston.format((info) => {
  if (info instanceof Error) {
    info.err = {
      name: info.name,
      message: info.message,
      stack: info.stack,
    };
  }
  return info;
});