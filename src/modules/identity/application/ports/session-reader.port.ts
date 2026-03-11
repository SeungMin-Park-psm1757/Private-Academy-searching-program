import { Role } from "../../domain/role";

export interface SessionUser {
  id: string;
  email: string;
  roles: Role[];
}

export interface SessionReaderPort {
  getCurrentUser(): Promise<SessionUser | null>;
}
