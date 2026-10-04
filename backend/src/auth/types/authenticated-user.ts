import {
  AccountType,
  UserRole,
} from '../../generated/prisma/client.js';

export interface AuthenticatedUser {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  accountType: AccountType;
}