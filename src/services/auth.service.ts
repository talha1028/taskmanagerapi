import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }
    async login(user: User) {
        const payload = { id: user.id, name: user.name, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            accessToken
        };
    }
    async geyUserbyID(id: number) {
        return this.userService.getOneUser(id);
    }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findbyEmail(email);

        if (!user || user.Password !== password) {
            throw new UnauthorizedException('Invalid email or password');
        }

        if (!user.Approved) {
            throw new UnauthorizedException('Your account is not approved yet');
        }

        const { Password, ...result } = user;
        return result;
    }
    async getAllUsers() {
        return this.userService.getUsers();
    }
}
