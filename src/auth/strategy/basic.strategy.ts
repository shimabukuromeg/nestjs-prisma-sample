import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        // ユーザーの検証ロジックをここに書きます。
        // この例では、ユーザー名とパスワードが特定の文字列と一致する場合にのみ認証が成功するとしています。
        const user = (username === 'username' && password === 'password') ? { username } : null;

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
