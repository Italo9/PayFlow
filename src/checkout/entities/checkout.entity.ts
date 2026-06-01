import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('Checkout')
export class Checkout {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  url: string;

  @Column({ type: 'double precision', nullable: true })
  valor: number;

  @Column()
  status: string;


  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
