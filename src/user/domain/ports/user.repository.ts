import { User } from '../user';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface CreateUserData {
  name: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: string;
  companyId: number;
}

export interface UpdateUserPatch {
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByCompany(companyId: number): Promise<User[]>;
  update(id: number, patch: UpdateUserPatch): Promise<void>;
  delete(id: number): Promise<void>;
  deleteByCompany(companyId: number): Promise<void>;
}
