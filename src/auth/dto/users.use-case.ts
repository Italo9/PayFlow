import { ApiProperty } from '@nestjs/swagger';

export class CreateUserStackDto {
  @ApiProperty({ description: 'Nome de exibição do usuário', example: 'João Silva' })
  display_name: string;

  @ApiProperty({ description: 'URL da imagem de perfil do usuário', example: 'https://example.com/profile.jpg', required: false })
  profile_image_url?: string;

  @ApiProperty({ description: 'Metadados do cliente', example: { role: 'admin' }, required: false })
  client_metadata?: Record<string, any>;

  @ApiProperty({ description: 'Metadados somente leitura do cliente', example: { lastLogin: '2023-01-01' }, required: false })
  client_read_only_metadata?: Record<string, any>;

  @ApiProperty({ description: 'Metadados do servidor', example: { verified: true }, required: false })
  server_metadata?: Record<string, any>;

  @ApiProperty({ description: 'Email principal do usuário', example: 'usuario@example.com' })
  primary_email: string;

  @ApiProperty({ description: 'Indica se o email principal foi verificado', example: true, required: false })
  primary_email_verified?: boolean;

  @ApiProperty({ description: 'Indica se a autenticação por email principal está habilitada', example: true, required: false })
  primary_email_auth_enabled?: boolean;

  @ApiProperty({ description: 'Senha do usuário', example: 'senha123' })
  password: string;

  @ApiProperty({ description: 'Segredo TOTP em base64', required: false })
  totp_secret_base64?: string;
}
export class UpdateUserStackDto {
  @ApiProperty({ description: 'Nome de exibição do usuário', example: 'João Silva', required: false })
  display_name?: string;

  @ApiProperty({ description: 'URL da imagem de perfil do usuário', example: 'https://example.com/profile.jpg', required: false })
  profile_image_url?: string;

  @ApiProperty({ description: 'Metadados do cliente', example: { role: 'admin' }, required: false })
  client_metadata?: Record<string, any>;

  @ApiProperty({ description: 'Metadados somente leitura do cliente', example: { lastLogin: '2023-01-01' }, required: false })
  client_read_only_metadata?: Record<string, any>;

  @ApiProperty({ description: 'Metadados do servidor', example: { verified: true }, required: false })
  server_metadata?: Record<string, any>;

  @ApiProperty({ description: 'Email principal do usuário', example: 'usuario@example.com', required: false })
  primary_email?: string;

  @ApiProperty({ description: 'Indica se o email principal foi verificado', example: true, required: false })
  primary_email_verified?: boolean;

  @ApiProperty({ description: 'Indica se a autenticação por email principal está habilitada', example: true, required: false })
  primary_email_auth_enabled?: boolean;

  @ApiProperty({ description: 'Senha do usuário', example: 'senha123', required: false })
  password?: string;

  @ApiProperty({ description: 'Segredo TOTP em base64', required: false })
  totp_secret_base64?: string;

  @ApiProperty({ description: 'ID da equipe selecionada', example: '12345678-1234-1234-1234-123456789012', required: false })
  selected_team_id?: string;
}
