import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToMany(() => Task, (task) => task.organization)
  tasks: Task[];
}