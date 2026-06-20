import { Controller, Post, Param, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Payment } from './entities/payment.entity';

@ApiTags('Pagamentos')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':paymentId/confirm')
  @ApiOperation({ summary: 'Confirmar um pagamento' })
  @ApiParam({ name: 'paymentId', description: 'ID do pagamento', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pagamento confirmado com sucesso',
    schema: {
      properties: {
        message: { type: 'string', example: 'Pagamento confirmado e ticket baixado com sucesso!' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async confirmPayment(
    @Param('paymentId') paymentId: number,
    @Body() processPaymentDto: ProcessPaymentDto,
  ) {
    const { transactionId } = processPaymentDto;

    return { message: 'Pagamento confirmado e ticket baixado com sucesso!' };
  }

  @Post('differential/:ticketId')
  @ApiOperation({ summary: 'Processar pagamento diferencial' })
  @ApiParam({ name: 'ticketId', description: 'ID do ticket', type: 'number' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa', type: 'number' })
  @ApiResponse({ status: 200, description: 'Pagamento diferencial processado com sucesso' })
  @ApiResponse({ status: 404, description: 'Ticket ou empresa não encontrados' })
  async processDifferentialPayment(
    @Param('ticketId') ticketId: number,
    @Param('companyId') companyId: number,
  ) {
    return '';
  }
}
