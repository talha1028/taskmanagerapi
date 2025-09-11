import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/services/auth.service";

@Injectable()
export class localStrategy extends PassportStrategy(Strategy) {
    constructor(private authservice: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authservice.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('not auth by jwt');
        }
        return user;
    }
}