import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Company } from './../../company/entities/company.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, nullable: true })
  lastName: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Exclude()
  @Column({ length: 255 })
  password: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
