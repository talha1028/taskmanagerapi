import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Task } from "../entities/task.entity"
import { UserRole } from "../DTOs/createuser.dto"
import { ApprovalRequest } from "./requestapproval.entity"
@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole

    @Column({ default: false })   
    Approved: boolean

    @OneToMany(() => Task, task => task.user)
    tasks: Task[];

    @OneToMany(() => ApprovalRequest, req => req.User)
    approvalRequests: ApprovalRequest[];
}
