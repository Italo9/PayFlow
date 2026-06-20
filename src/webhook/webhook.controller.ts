import { Body, Controller, Post, Param } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Webhooks')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post(':sessionId')
  @ApiOperation({ summary: 'Webhook para receber confirmação de pagamento' })
  @ApiParam({ name: 'sessionId', description: 'Número da sessão', example: '1a805e1f-1769-4abe-ba81-6c3d3d8db343' })
  @ApiBody({ 
    schema: { 
      type: 'object',
      properties: {
        transactionId: { type: 'string', example: 'txn_123456789' },
        status: { type: 'string', example: 'approved' },
        amount: { type: 'number', example: 100.00 },
        payment_method: { type: 'string', example: 'credit_card' },
        metadata: { 
          type: 'object',
          example: {
            customer_id: '123',
            company_id: '456'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pagamento processado com sucesso',
    schema: {
      properties: {
        message: { type: 'string', example: 'Pagamento confirmado para a sessão 8f5cbdbe-c64e-4eee-b46b-1df3d7fb7a27' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada' })
  async paymentWebhook(
    @Param('sessionId') sessionId: string,
    @Body() paymentDetails: any,
  ): Promise<{ message: string }> {
    console.log(`Pagamento recebido para a sessão: ${sessionId}`);
    console.log(paymentDetails);
    await this.webhookService.handlePaymentWebhook(sessionId, paymentDetails);

    return { message: `Pagamento confirmado para a sessão ${sessionId}` };
  }
}
