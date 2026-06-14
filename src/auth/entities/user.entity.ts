import { ApiProperty } from '@nestjs/swagger';

export class UserAuth {
  @ApiProperty({ description: 'ID único do usuário', example: '12345678-1234-1234-1234-123456789012' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  name: string;

  @ApiProperty({ description: 'Email do usuário', example: 'usuario@example.com' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'senha123' })
  password: string;
}

export class Pagination {
  @ApiProperty({ description: 'Cursor para a próxima página de resultados', example: 'next_page_token' })
  next_cursor: string;
}

export class SelectedTeam {
  @ApiProperty({ description: 'Data de criação da equipe em milissegundos', example: 1609459200000 })
  created_at_millis: number;

  @ApiProperty({ description: 'ID único da equipe', example: '12345678-1234-1234-1234-123456789012' })
  id: string;

  @ApiProperty({ description: 'Nome de exibição da equipe', example: 'Minha Equipe' })
  display_name: string;

  @ApiProperty({ description: 'URL da imagem de perfil da equipe', example: 'https://example.com/profile.jpg' })
  profile_image_url: string;

  @ApiProperty({ description: 'Metadados do servidor', example: { verified: true } })
  server_metadata: Record<string, any>;

  @ApiProperty({ description: 'Metadados do cliente', example: { role: 'admin' } })
  client_metadata: Record<string, any>;

  @ApiProperty({ description: 'Metadados somente leitura do cliente', example: { lastLogin: '2023-01-01' } })
  client_read_only_metadata: Record<string, any>;
}

export class UserItem {
  @ApiProperty({ description: 'ID único do usuário', example: '12345678-1234-1234-1234-123456789012' })
  id: string;

  @ApiProperty({ description: 'Indica se o email principal foi verificado', example: true })
  primary_email_verified: boolean;

  @ApiProperty({ description: 'Indica se a autenticação por email principal está habilitada', example: true })
  primary_email_auth_enabled: boolean;

  @ApiProperty({ description: 'Data de cadastro em milissegundos', example: 1609459200000 })
  signed_up_at_millis: number;

  @ApiProperty({ description: 'Data da última atividade em milissegundos', example: 1609459200000 })
  last_active_at_millis: number;

  @ApiProperty({ description: 'Email principal do usuário', example: 'usuario@example.com' })
  primary_email: string;

  @ApiProperty({ description: 'Nome de exibição do usuário', example: 'João Silva' })
  display_name: string;

  @ApiProperty({ description: 'Equipe selecionada', type: SelectedTeam })
  selected_team: SelectedTeam;

  @ApiProperty({ description: 'ID da equipe selecionada', example: '12345678-1234-1234-1234-123456789012' })
  selected_team_id: string;

  @ApiProperty({ description: 'URL da imagem de perfil do usuário', example: 'https://example.com/profile.jpg' })
  profile_image_url: string;

  @ApiProperty({ description: 'Metadados do cliente', example: { role: 'admin' } })
  client_metadata: Record<string, any>;

  @ApiProperty({ description: 'Metadados somente leitura do cliente', example: { lastLogin: '2023-01-01' } })
  client_read_only_metadata: Record<string, any>;

  @ApiProperty({ description: 'Metadados do servidor', example: { verified: true } })
  server_metadata: Record<string, any>;
}

export class UserListAllStackAuth {
  @ApiProperty({ description: 'Lista de itens de usuários', type: [UserItem] })
  items: UserItem[];

  @ApiProperty({ description: 'Informações de paginação', required: false })
  pagination?: Pagination;
}

export class UserStackAuth {
  @ApiProperty({ description: 'Código de status da resposta', example: 200 })
  status: number;

  @ApiProperty({
    description: 'Dados do usuário',
    example: {
      id: '12345678-1234-1234-1234-123456789012',
      primary_email_verified: true,
      primary_email_auth_enabled: true,
      signed_up_at_millis: 1609459200000,
      last_active_at_millis: 1609459200000,
      primary_email: 'usuario@example.com',
      display_name: 'João Silva',
      selected_team_id: '12345678-1234-1234-1234-123456789012',
      profile_image_url: 'https://example.com/profile.jpg'
    }
  })
  data: {
    id: string;
    primary_email_verified: boolean;
    primary_email_auth_enabled: boolean;
    signed_up_at_millis: number;
    last_active_at_millis: number;
    primary_email: string;
    display_name: string;
    selected_team?: {
      created_at_millis: number;
      id: string;
      display_name: string;
      server_metadata?: Record<string, any>;
      profile_image_url?: string;
      client_metadata?: Record<string, any>;
      client_read_only_metadata?: Record<string, any>;
    };
    selected_team_id?: string;
    profile_image_url?: string;
    client_metadata?: Record<string, any>;
    client_read_only_metadata?: Record<string, any>;
    server_metadata?: Record<string, any>;
  };
}
