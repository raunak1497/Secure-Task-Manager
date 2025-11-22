import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';

export enum Role {
  Owner = 'OWNER',
  Admin = 'ADMIN',
  Viewer = 'VIEWER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
  })
  role: Role;

  @ManyToOne(() => Organization, (org) => org.users)
  organization: Organization;
}