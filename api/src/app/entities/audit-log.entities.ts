import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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

  // ✅ allow NULL to avoid constraint errors
  @Column({ type: 'integer', nullable: true })
  organizationId: number | null;

  @CreateDateColumn()
  createdAt: Date;
}