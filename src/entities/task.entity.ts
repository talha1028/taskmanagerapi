import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../entities/user.entity";
import { IsOptional } from "class-validator";

export enum TaskStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
}

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}
@Entity('Task')
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    @IsOptional()
    description?: string;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
    status: TaskStatus;

    @Column({ type: 'enum', enum: TaskPriority, nullable: true })
    @IsOptional()
    priority?: TaskPriority;

    @Column({ type: 'date', nullable: true })
    @IsOptional()
    dueDate?: Date;
    
    @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}