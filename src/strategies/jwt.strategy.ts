import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstant } from 'src/guards/secretkey';
import { UserRole } from 'src/DTOs/createuser.dto';
@Injectable()
export class jwtstrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstant.secret,
        });
    }
    async validate(payload: any){
        return {
            userId: payload.id,
            name: payload.name,
            role: payload.role as UserRole,
            approvalstatus: payload.Approved
        }
    }
}