
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, LoggerService, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        this.logger.log(`Before...`);

        const req = context.switchToHttp().getRequest();

        const info = `${req.method} ${req.url} for ${req.ip}`;
        this.logger.log(`Started ${info}`);

        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() => this.logger.log(`After... ${Date.now() - now}ms`)),
            );
    }
}
