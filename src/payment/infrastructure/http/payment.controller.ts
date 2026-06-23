import { Controller, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProcessPaymentDto } from '../../dto/process-payment.dto';

@ApiTags('Pagamentos')
@Controller('payment')
export class PaymentController {
  @Post(':paymentId/confirm')
  @ApiOperation({ summary: 'Confirmar um pagamento' })
  @ApiParam({ name: 'paymentId', description: 'ID do pagamento', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Pagamento confirmado com sucesso',
    schema: {
      properties: {
        message: { type: 'string', example: 'Pagamento confirmado e ticket baixado com sucesso!' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Pagamento nao encontrado' })
  confirmPayment(
    @Param('paymentId') paymentId: number,
    @Body() processPaymentDto: ProcessPaymentDto,
  ) {
    return { message: 'Pagamento confirmado e ticket baixado com sucesso!' };
  }

  @Post('differential/:ticketId')
  @ApiOperation({ summary: 'Processar pagamento diferencial' })
  @ApiParam({ name: 'ticketId', description: 'ID do ticket', type: 'number' })
  @ApiResponse({ status: 200, description: 'Pagamento diferencial processado com sucesso' })
  @ApiResponse({ status: 404, description: 'Ticket ou empresa nao encontrados' })
  processDifferentialPayment(
    @Param('ticketId') ticketId: number,
    @Param('companyId') companyId: number,
  ) {
    return '';
  }
}
