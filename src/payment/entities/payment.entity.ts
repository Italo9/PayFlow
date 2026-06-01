import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Checkout } from './../../checkout/entities/checkout.entity';


@Entity('Payment')
export class Payment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 50 })
  paymentMethod: string;

  @Column({ type: 'double precision' })
  value: number;

  @Column({ nullable: true })
  repayment: boolean;

  @Column({ type: 'timestamptz' })
  paymentDate: Date;

  @ManyToOne(() => Checkout)
  @JoinColumn({ name: 'checkoutId' })
  checkout: Checkout;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
