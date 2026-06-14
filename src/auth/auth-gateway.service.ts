import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { CompanySettingService } from '../company-setting/company-setting.service';

interface Gateway {
  PAYCO_CLIENT_ID: string;
  PAYCO_CLIENT_SECRET: string;
}

@Injectable()
export class AuthGatewayService {
  private readonly authUrl: string;

  constructor(private companySettingService: CompanySettingService) {
    this.authUrl = process.env.PAYCO_AUTH_URL as string;
  }

  async getAccessToken(comapnyID): Promise<string> {
    try {
      const companySettings = await this.companySettingService.findOneCompanyId(
        Number(comapnyID),
      );

      if (!companySettings || !companySettings.gateway) {
        throw new HttpException(
          'Configurações da empresa não encontradas',
          HttpStatus.NOT_FOUND,
        );
      }
  
      const gateway = companySettings.gateway as Gateway;

      if (!gateway.PAYCO_CLIENT_ID || !gateway.PAYCO_CLIENT_SECRET) {
        throw new HttpException(
          'Credenciais do gateway não configuradas',
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
      console.error('Erro ao autenticar:', error);
      throw new HttpException(
        'Erro ao autenticar com o Payco',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
