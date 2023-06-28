import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './strategy/basic.strategy';

@Module({
    imports: [PassportModule],
    providers: [BasicStrategy],
})
export class AuthModule { }