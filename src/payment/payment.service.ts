import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async processPayment(paymentDetails: any) {
    const companyId = paymentDetails.companyId;
    const status = paymentDetails.status;
    const receivData = paymentDetails.receivData;
    const payment = this.paymentRepository.create({
      companyId,
      status,
      receivData,
    });

    const result = await this.paymentRepository.save(payment);
    console.log('resultresultresult', result);
  }

  async findPaymentBySessionIdAndItemCode(
    sessionId: string,
  ): Promise<Payment | null> {
    console.log('Iniciando a busca pelo pagamento com sessionId:', sessionId);

    const payments = await this.paymentRepository.find();
    console.log('Pagamentos encontrados:', payments.length);

    const payment = payments.find((payment) => {
      let receivData;

      try {
        receivData =
          typeof payment.receivData === 'string'
            ? JSON.parse(payment.receivData)
            : payment.receivData;

        console.log(
          'Verificando pagamento:',
          payment.id,
          'com receivData.id:',
          receivData.id,
        );

        if (receivData.items[0].code !== sessionId) {
          console.log('sessionId não corresponde ao pagamento');
          return false;
        }

        console.log('sessionId corresponde ao pagamento');
        return true;
      } catch (error) {
        console.error('Erro ao processar receivData:', error);
        return false;
      }
    }) as Payment;

    if (payment) {
      console.log('Pagamento encontrado:', payment.id);
    } else {
      console.log('Pagamento não encontrado');
    }

    return payment;
  }

  async updatePaymentStatus(
    sessionId: string,
    newStatus: string,
  ): Promise<Payment> {
    const payment = await this.findPaymentBySessionIdAndItemCode(sessionId);

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    payment.status = newStatus;

    return await this.paymentRepository.save(payment);
  }
}
