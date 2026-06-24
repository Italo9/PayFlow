import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { GetCompanySettingByCompanyUseCase } from '../company-setting/application/get-company-setting-by-company.usecase';

interface Gateway {
  PAYCO_CLIENT_ID: string;
  PAYCO_CLIENT_SECRET: string;
}

@Injectable()
export class AuthGatewayService {
  private readonly authUrl: string;

  constructor(private readonly getSetting: GetCompanySettingByCompanyUseCase) {
    this.authUrl = process.env.PAYCO_AUTH_URL as string;
  }

  async getAccessToken(companyId): Promise<string> {
    try {
      const setting = await this.getSetting.execute(Number(companyId));

      if (!setting || !setting.gateway) {
        throw new HttpException(
          'Configuracoes da empresa nao encontradas',
          HttpStatus.NOT_FOUND,
        );
      }

      const gateway = setting.gateway as Gateway;

      if (!gateway.PAYCO_CLIENT_ID || !gateway.PAYCO_CLIENT_SECRET) {
        throw new HttpException(
          'Credenciais do gateway nao configuradas',
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = new URLSearchParams();
      data.append('client_id', gateway.PAYCO_CLIENT_ID);
      data.append('client_secret', gateway.PAYCO_CLIENT_SECRET);
      data.append('grant_type', 'client_credentials');

      const response = await axios.post(this.authUrl, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data && response.data.access_token) {
        return response.data.access_token;
      } else {
        throw new HttpException(
          'Erro ao obter token de acesso',
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Erro ao autenticar:', error);
      throw new HttpException(
        'Erro ao autenticar com o Payco',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
