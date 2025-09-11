import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity("ApprovalRequest")
export class ApprovalRequest {
  @PrimaryGeneratedColumn()
  ID: number;

  @ManyToOne(() => User, user => user.approvalRequests, { onDelete: "CASCADE" })
  User: User;

  @Column({ default: "PENDING" }) // PENDING, APPROVED, REJECTED
  Status: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  CreatedAt: Date;
}
