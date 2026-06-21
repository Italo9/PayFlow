export class User {
  constructor(
    public readonly id: number | null,
    public name: string,
    public lastName: string,
    public email: string,
    public password: string,
    public role: string,
    public readonly companyId: number | null,
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

export class UserUnauthorized extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserUnauthorized';
  }
}

export class UserForbidden extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserForbidden';
  }
}

export class UserBadRequest extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserBadRequest';
  }
}

export class UserCompanyNotFound extends Error {
  constructor() {
    super('Empresa nao encontrada');
    this.name = 'UserCompanyNotFound';
  }
}
