export class User {
  constructor(
    public readonly id: number | null,
    public name: string,
    public lastName: string,
    public email: string,
    public password: string,
    public role: string,
    public companyId: number | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  isManager(): boolean {
    return this.role.toLowerCase() === 'manager';
  }

  isAdmin(): boolean {
    return this.role.toLowerCase() === 'admin';
  }
}

export class UserNotFound extends Error {
  constructor() {
    super('Usuario nao encontrado');
    this.name = 'UserNotFound';
  }
}

export class UserOperationNotAllowed extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserOperationNotAllowed';
  }
}

export class InvalidToken extends Error {
  constructor() {
    super('Token invalido');
    this.name = 'InvalidToken';
  }
}

export class AuthenticatedUserNotFound extends Error {
  constructor() {
    super('Usuario logado nao encontrado');
    this.name = 'AuthenticatedUserNotFound';
  }
}

export class ExternalUserCreationFailed extends Error {
  constructor() {
    super('Falha ao criar usuario no servico externo');
    this.name = 'ExternalUserCreationFailed';
  }
}

export class CompanyNotFound extends Error {
  constructor() {
    super('Empresa nao encontrada');
    this.name = 'CompanyNotFound';
  }
}
