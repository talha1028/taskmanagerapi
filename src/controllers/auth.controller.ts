import {
    Controller,
    Post,
    Get,
    HttpCode,
    HttpStatus,
    UseGuards,
    Request
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // ✅ Login endpoint
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'admin@example.com' },
                password: { type: 'string', example: 'StrongPass123' },
            },
            required: ['email', 'password'],
        },
    })
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    // ✅ Restrict this to ADMINs only
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    @ApiBearerAuth('access-token')
    @Get('all-users')
    getAllUsers() {
        return this.authService.getAllUsers();
    }
}
