import { hasAnyRole, Role } from "../../domain/role";
import { SessionUser } from "../../application/ports/session-reader.port";

export function canAccessRoles(
  user: SessionUser | null,
  expectedRoles: Role[],
): boolean {
  if (!user) {
    return false;
  }

  return hasAnyRole(user.roles, expectedRoles);
}

export function assertRoles(
  user: SessionUser | null,
  expectedRoles: Role[],
): asserts user is SessionUser {
  if (!canAccessRoles(user, expectedRoles)) {
    throw new Error("Forbidden");
  }
}
