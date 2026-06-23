import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentController } from './infrastructure/http/payment.controller';
import { TypeOrmPaymentRepository } from './infrastructure/persistence/typeorm-payment.repository';
import { PAYMENT_REPOSITORY } from './domain/ports/payment.repository';
import { ProcessPaymentUseCase } from './application/process-payment.usecase';
import { FindPaymentBySessionUseCase } from './application/find-payment-by-session.usecase';
import { UpdatePaymentStatusUseCase } from './application/update-payment-status.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentController],
  providers: [
    { provide: PAYMENT_REPOSITORY, useClass: TypeOrmPaymentRepository },
    ProcessPaymentUseCase,
    FindPaymentBySessionUseCase,
    UpdatePaymentStatusUseCase,
  ],
  exports: [ProcessPaymentUseCase, UpdatePaymentStatusUseCase, TypeOrmModule],
})
export class PaymentModule {}
