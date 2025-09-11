import { Module } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { AdminController } from '../controllers/admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalRequest } from 'src/entities/requestapproval.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ApprovalRequest,User])],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
