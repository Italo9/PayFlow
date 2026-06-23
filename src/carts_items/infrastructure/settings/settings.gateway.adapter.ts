import { Injectable } from '@nestjs/common';
import { SettingsGateway } from '../../domain/ports/settings-gateway';
import { IsCarPaymentActiveUseCase } from '../../../company-setting/application/is-car-payment-active.usecase';

@Injectable()
export class SettingsGatewayAdapter implements SettingsGateway {
  constructor(private readonly checkCarPayment: IsCarPaymentActiveUseCase) {}

  isCarPaymentActive(companyId: number): Promise<boolean> {
    return this.checkCarPayment.execute(companyId);
  }
}
