import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('readings')
export class Reading {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sensor: string;

  @Column('float')
  value: number;

  @CreateDateColumn()
  createdAt: Date;
}
