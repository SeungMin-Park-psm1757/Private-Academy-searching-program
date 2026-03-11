export interface FeatureFlags {
  billingEnabled: boolean;
  academyMessagingEnabled: boolean;
  adminMfaEnforced: boolean;
}

export function getFeatureFlags(): FeatureFlags {
  return {
    billingEnabled: process.env.NEXT_PUBLIC_ENABLE_BILLING === "true",
    academyMessagingEnabled:
      process.env.NEXT_PUBLIC_ENABLE_MESSAGING !== "false",
    adminMfaEnforced: process.env.ENFORCE_ADMIN_MFA === "true",
  };
}
