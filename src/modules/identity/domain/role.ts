export const roles = [
  "parent_member",
  "academy_editor",
  "academy_owner",
  "platform_reviewer",
  "platform_admin",
  "support_readonly",
] as const;

export type Role = (typeof roles)[number];

export function hasAnyRole(currentRoles: Role[], expectedRoles: Role[]): boolean {
  return expectedRoles.some((role) => currentRoles.includes(role));
}
