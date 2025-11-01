import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
  Patch
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserOwnershipGuard } from 'src/guards/userownership.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/DTOs/createuser.dto';
import { CreateUserDTO } from '../DTOs/createuser.dto';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { UpdateUserDTO } from '../DTOs/updateUser.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  // ✅ Signup is public
  @Post('createuser')
  @ApiBody({ type: CreateUserDTO })
  createUser(@Body() createUserDto: CreateUserDTO) {
    return this.userService.createUser(createUserDto);
  }

  // ✅ Only ADMIN can see all users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(UserRole.ADMIN)
  @Get('all')
  @ApiOkResponse({ type: [User], description: 'List of all users' })
  getAllUsers() {
    return this.userService.getUsers();
  }

  // ✅ Authenticated users can see their own profile (or admins can see any)
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @ApiBearerAuth('access-token')
  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'USERID' })
  getUser(@Param('id') id: string) {
    return this.userService.getOneUser(Number(id));
  }

  // ✅ Authenticated users can delete themselves (or admins can delete any user)
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, description: 'USERID' })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(Number(id));
  }

  // ✅ Authenticated users can update their own account (or admins can update any user)
  @UseGuards(JwtAuthGuard, UserOwnershipGuard)
  @ApiBearerAuth('access-token')
  @Patch('updateUser/:id')
  @ApiBody({ type: UpdateUserDTO })
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO
  ) {
    return this.userService.updateUser(Number(id), updateUserDto);
  }
}
