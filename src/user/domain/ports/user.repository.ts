import { User } from '../user';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface NewUserData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  companyId: number;
}

export interface UserPatch {
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  companyId?: number;
}

export interface UserRepository {
  create(data: NewUserData): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByCompany(companyId: number): Promise<User[]>;
  update(id: number, patch: UserPatch): Promise<void>;
  delete(id: number): Promise<void>;
  deleteByCompany(companyId: number): Promise<void>;
}
