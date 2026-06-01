import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './../../company/entities/company.entity';

@Entity('CompanySetting')
export class CompanySetting {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'double precision' })
  ValeHour: number;

  @Column({ type: 'double precision' })
  ValueFractionHour: number;

  @Column()
  autoRecharge: boolean;

  @Column({ type: 'time' })
  timeTolerance: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
