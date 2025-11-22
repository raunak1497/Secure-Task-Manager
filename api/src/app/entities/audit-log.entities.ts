import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column()
  userEmail: string;

  @Column()
  role: string;

  @Column()
  organizationId: number;

  @CreateDateColumn()
  createdAt: Date;  // IMPORTANT: name must match here
}