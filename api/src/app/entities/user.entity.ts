import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Task } from './task.entity';

export enum Role {
  Owner = 'OWNER',
  Admin = 'ADMIN',
  Viewer = 'VIEWER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    default: Role.Viewer,
  })
  role: Role;

  @ManyToOne(() => Organization, (org) => org.users, { eager: true })
  organization: Organization;

  @OneToMany(() => Task, (task) => task.createdBy)
  tasks: Task[];
}