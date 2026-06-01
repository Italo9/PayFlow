import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Company')
export class Company {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 14 })
  cnpj: string;

  @Column()
  active: boolean;

  @Column({ length: 255, nullable: true })
  responsiblePerson: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
