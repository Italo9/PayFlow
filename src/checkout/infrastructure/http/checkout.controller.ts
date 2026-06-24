import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePaymentDto } from '../../dto/create-checkout.dto';
import { CreateCheckoutUseCase } from '../../application/create-checkout.usecase';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly createCheckout: CreateCheckoutUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma cobranca de checkout via PIX' })
  @ApiResponse({ status: 201, description: 'Cobranca criada com sucesso' })
  async create(
    @Body() body: CreatePaymentDto,
  ): Promise<{ qr_code: string; payment_url: string }> {
    const result = await this.createCheckout.execute(
      {
        sessionId: body.sessionId as string,
        customer: body.customer,
        callback_url: body.callback_url,
      },
      body.companyId as number,
    );
    return { qr_code: result.qrCodePix, payment_url: result.pixUrl };
  }
}
