import { Controller, UseGuards, Get, Post, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/DTOs/createuser.dto';
import { AdminService } from '../services/admin.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('admin')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('approval-requests')
  getRequests() {
    return this.adminService.getRequests();
  }

  @Post('approve/:id')
  approveRequest(@Param('id') id: number) {
    return this.adminService.approveRequest(id);
  }

  @Post('reject/:id')
  rejectRequest(@Param('id') id: number) {
    return this.adminService.rejectRequest(id);
  }
}
