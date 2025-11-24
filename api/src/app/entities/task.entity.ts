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

  @Column({ default: 'Pending' })
  status: string; // 'Pending' | 'In Progress' | 'Completed'

  @ManyToOne(() => User, (user) => user.tasks, { eager: false, nullable: true })
  createdBy: User | null;

  @ManyToOne(() => Organization, (org) => org.tasks, {
    eager: false,
    nullable: true,
  })
  organization: Organization | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}