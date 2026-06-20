import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreatePaymentDto } from './dto/create-checkout.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async createCheckout(
    @Body() createPaymentDto: any,
  ): Promise<{ qr_code: string; payment_url: string }> {
    console.log('cheguei na controller', createPaymentDto);
    const paymentUrl = await this.checkoutService.createPayment(
      createPaymentDto,
      createPaymentDto.companyId as number,
    );
    return { qr_code: paymentUrl.qrCodePix, payment_url: paymentUrl.pixUrl };
  }
}
