import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO, UserRole } from '../DTOs/createuser.dto';
import { UpdateUserDTO } from '../DTOs/updateUser.dto';
import { ApprovalRequest } from '../entities/requestapproval.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(ApprovalRequest)
    private approvalRequestRepo: Repository<ApprovalRequest>,
  ) {}

  async createUser(createUserdto: CreateUserDTO) {
    // ✅ ensure default admin exists
    const existingAdmin = await this.userRepo.findOne({
      where: { role: UserRole.ADMIN },
    });

    if (!existingAdmin) {
      const admin = this.userRepo.create({
        name: 'Super Admin',
        Email: 'admin@example.com',
        Password: '12345678',
        role: UserRole.ADMIN,
        Approved: true, // Admin is always approved
      });
      await this.userRepo.save(admin);
      console.log('✅ Default admin created');
    }

    // ✅ create new user
    const user = this.userRepo.create({
      ...createUserdto,
      Approved: false, // new users are unapproved
    });

    const savedUser = await this.userRepo.save(user);

    // ✅ automatically create approval request for this user
    const approvalRequest = this.approvalRequestRepo.create({
      User: savedUser,
      Status: 'PENDING',
    });

    await this.approvalRequestRepo.save(approvalRequest);

    return savedUser;
  }

  async getUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async getOneUser(id: number): Promise<User | null> {
    return await this.userRepo.findOneBy({ id: id });
  }

  async deleteUser(id: number) {
    return this.userRepo.delete(id);
  }

  async updateUser(id: number, updateuserDTO: UpdateUserDTO) {
    await this.userRepo.update(id, updateuserDTO);
    return this.userRepo.findOneBy({ id: id });
  }

  async findbyEmail(email: string) {
    const user = await this.userRepo.findOneBy({ Email: email });
    return user;
  }
}
