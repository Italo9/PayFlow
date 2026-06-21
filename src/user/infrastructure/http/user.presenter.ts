import { User } from '../../domain/user';

export class UserPresenter {
  static toHttp(user: User) {
    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
