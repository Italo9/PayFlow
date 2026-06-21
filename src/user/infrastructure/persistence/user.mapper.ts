import { User } from '../../domain/user';
import { User as UserOrm } from '../../entities/user.entity';

export class UserMapper {
  static toDomain(row: UserOrm): User {
    return new User(
      Number(row.id),
      row.name,
      row.lastName,
      row.email,
      row.password,
      row.role,
      row.company?.id ?? null,
      row.created_at,
      row.updated_at,
    );
  }
}
