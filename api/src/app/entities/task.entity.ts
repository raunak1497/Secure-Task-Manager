import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  category: string;

  // ⭐ The missing status column — this was why your status never updated
  @Column({ default: 'Pending' })
  status: string;

  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  createdBy: User;

  @ManyToOne(() => Organization, (org) => org.tasks, { eager: false })
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}