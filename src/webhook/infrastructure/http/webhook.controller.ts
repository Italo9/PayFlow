import { Body, Controller, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  ProcessPaymentWebhookUseCase,
  WebhookPayload,
} from '../../application/process-payment-webhook.usecase';

@ApiTags('Webhooks')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly processWebhook: ProcessPaymentWebhookUseCase) {}

  @Post(':sessionId')
  @ApiOperation({ summary: 'Webhook para receber confirmacao de pagamento' })
  @ApiParam({
    name: 'sessionId',
    description: 'Numero da sessao',
    example: '1a805e1f-1769-4abe-ba81-6c3d3d8db343',
  })
  @ApiResponse({ status: 200, description: 'Pagamento processado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados invalidos' })
  @ApiResponse({ status: 404, description: 'Sessao nao encontrada' })
  async paymentWebhook(
    @Param('sessionId') sessionId: string,
    @Body() paymentDetails: WebhookPayload,
  ): Promise<{ message: string }> {
    await this.processWebhook.execute(sessionId, paymentDetails);
    return { message: `Pagamento confirmado para a sessao ${sessionId}` };
  }
}
