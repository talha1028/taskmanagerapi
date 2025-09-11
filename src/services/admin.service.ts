import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalRequest } from '../entities/requestapproval.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(ApprovalRequest)
    private readonly approvalRequestRepo: Repository<ApprovalRequest>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getRequests() {
    return this.approvalRequestRepo.find({
      where: { Status: 'PENDING' },
      relations: ['User'],
    });
  }

  async approveRequest(id: number) {
    const request = await this.approvalRequestRepo.findOne({
      where: { ID: id },
      relations: ['User'],
    });

    if (!request) throw new NotFoundException('Approval request not found');

    request.Status = 'APPROVED';
    await this.approvalRequestRepo.save(request);

    request.User.Approved = true;
    await this.userRepo.save(request.User);

    return { message: 'User approved successfully' };
  }

  async rejectRequest(id: number) {
    const request = await this.approvalRequestRepo.findOne({ where: { ID: id } });

    if (!request) throw new NotFoundException('Approval request not found');

    request.Status = 'REJECTED';
    await this.approvalRequestRepo.save(request);

    return { message: 'User rejected' };
  }
}
