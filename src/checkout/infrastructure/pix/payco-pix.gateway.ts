import { Injectable } from '@nestjs/common';
import {
  PixGateway,
  PixChargeRequest,
  PixChargeResult,
} from '../../domain/ports/pix-gateway';
import { AuthGatewayService } from '../../../auth/auth-gateway.service';

interface PixResponse {
  payment_methods: { pix: { qr_code: string; final_amount: number; status: string } };
}

@Injectable()
export class PaycoPixGateway implements PixGateway {
  private readonly gatewayUrl: string = process.env.PAYCO_URL as string;

  constructor(private readonly authGateway: AuthGatewayService) {}

  async createCharge(companyId: number, request: PixChargeRequest): Promise<PixChargeResult> {
    const accessToken = await this.authGateway.getAccessToken(companyId);

    const payload = {
      items: request.items,
      customer: request.customer,
      shipping: {
        name: 'Nome do Destinatario',
        street: 'Rua Exemplo',
        number: '456',
        complement: '',
        neighborhood: 'Bairro Exemplo',
        city: 'Cidade Exemplo',
        state: 'SP',
        zip_code: '01020000',
      },
      allowed_methods: ['PIX'],
      discounts: [{ method: 'CARD', type: 'PERCENTAGE', value: 10 }],
      callback_url: request.callbackUrl,
    };

    const response = await fetch(`${this.gatewayUrl}/public-api/api/v1/checkout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });
    const result = JSON.parse(await response.text());

    const expirationDate = new Date(Date.now() + 100 * 60 * 1000).toISOString();

    const responsePix = await fetch(
      `${this.gatewayUrl}/public-api/api/v1/checkout/${result.id}/payments/pix`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expiration_date: expirationDate }),
      },
    );
    const resultPix = JSON.parse(await responsePix.text()) as PixResponse;

    return {
      pixCode: resultPix.payment_methods.pix.qr_code,
      finalAmount: resultPix.payment_methods.pix.final_amount,
      status: resultPix.payment_methods.pix.status,
      raw: result,
    };
  }
}
