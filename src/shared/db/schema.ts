import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const withTimestamps = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

const withCreatedAt = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const authProviderEnum = pgEnum("auth_provider", [
  "credentials",
  "google",
  "kakao",
]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "invited",
  "suspended",
  "deleted",
]);

export const userRoleEnum = pgEnum("user_role", [
  "parent",
  "academy_editor",
  "academy_owner",
  "platform_reviewer",
  "platform_admin",
  "support_readonly",
]);

export const tokenPurposeEnum = pgEnum("token_purpose", [
  "email_verify",
  "password_reset",
  "invite",
]);

export const organizationStatusEnum = pgEnum("organization_status", [
  "active",
  "suspended",
  "archived",
]);

export const branchStatusEnum = pgEnum("branch_status", [
  "draft",
  "pending_review",
  "published",
  "suspended",
  "archived",
]);

export const staffScopeEnum = pgEnum("staff_scope", [
  "organization",
  "branch",
]);

export const staffRoleEnum = pgEnum("staff_role", [
  "owner",
  "editor",
  "viewer",
]);

export const placeProviderEnum = pgEnum("place_provider", [
  "kakao_local",
  "manual",
  "other",
]);

export const locationSourceTypeEnum = pgEnum("location_source_type", [
  "kakao_seed",
  "academy_self_report",
  "admin_verified",
  "system_derived",
]);

export const claimStatusEnum = pgEnum("claim_status", [
  "pending",
  "approved",
  "rejected",
  "withdrawn",
]);

export const subjectEnum = pgEnum("subject", [
  "math",
  "english",
  "korean",
  "science",
  "coding",
  "essay",
  "social_studies",
  "other",
]);

export const deliveryModeEnum = pgEnum("delivery_mode", [
  "offline",
  "online",
  "hybrid",
]);

export const programStatusEnum = pgEnum("program_status", [
  "draft",
  "published",
  "archived",
]);

export const classGroupStatusEnum = pgEnum("class_group_status", [
  "draft",
  "published",
  "paused",
  "archived",
]);

export const recommendationStatusEnum = pgEnum("recommendation_status", [
  "open",
  "waitlist_only",
  "closed",
]);

export const conversationStatusEnum = pgEnum("conversation_status", [
  "open",
  "closed",
  "blocked",
]);

export const senderTypeEnum = pgEnum("sender_type", [
  "parent",
  "academy_staff",
  "admin",
  "system",
]);

export const auditEntityTypeEnum = pgEnum("audit_entity_type", [
  "service_region",
  "academy_organization",
  "academy_branch",
  "academy_claim_request",
  "program",
  "class_group",
  "schedule_rule",
  "conversation",
  "message",
  "billing_plan",
  "subscription",
  "user_role",
]);

export const auditActionEnum = pgEnum("audit_action", [
  "create",
  "update",
  "delete",
  "publish",
  "suspend",
  "approve",
  "reject",
  "rollback",
]);

export const billingIntervalEnum = pgEnum("billing_interval", [
  "one_time",
  "month",
  "year",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "failed",
  "canceled",
  "refunded",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "requested",
  "authorized",
  "done",
  "failed",
  "canceled",
  "refunded",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "trialing",
  "active",
  "past_due",
  "canceled",
  "paused",
  "expired",
]);

export const distanceBasisEnum = pgEnum("distance_basis", ["home", "school"]);

export const serviceRegions = pgTable(
  "service_regions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 64 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    city: varchar("city", { length: 80 }).notNull(),
    district: varchar("district", { length: 80 }),
    centerLat: doublePrecision("center_lat"),
    centerLng: doublePrecision("center_lng"),
    defaultRadiusMeters: integer("default_radius_meters").notNull().default(3000),
    geoJson: jsonb("geo_json").$type<Record<string, unknown>>(),
    isLaunchRegion: boolean("is_launch_region").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    ...withTimestamps(),
  },
  (table) => ({
    codeUk: uniqueIndex("service_regions_code_uk").on(table.code),
    activeIdx: index("service_regions_active_idx").on(table.isActive),
  }),
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    displayName: varchar("display_name", { length: 120 }),
    phoneE164: varchar("phone_e164", { length: 32 }),
    authProvider: authProviderEnum("auth_provider").notNull().default("credentials"),
    status: userStatusEnum("status").notNull().default("active"),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    ...withTimestamps(),
  },
  (table) => ({
    emailUk: uniqueIndex("users_email_uk").on(table.email),
    statusIdx: index("users_status_idx").on(table.status),
  }),
);

export const passwordCredentials = pgTable(
  "password_credentials",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    passwordHash: text("password_hash").notNull(),
    passwordVersion: integer("password_version").notNull().default(1),
    ...withTimestamps(),
  },
  (table) => ({
    userIdUk: uniqueIndex("password_credentials_user_id_uk").on(table.userId),
  }),
);

export const authSessions = pgTable(
  "auth_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    ipHash: varchar("ip_hash", { length: 128 }),
    userAgent: text("user_agent"),
    ...withCreatedAt(),
  },
  (table) => ({
    userIdx: index("auth_sessions_user_idx").on(table.userId),
    expiresIdx: index("auth_sessions_expires_idx").on(table.expiresAt),
  }),
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    purpose: tokenPurposeEnum("purpose").notNull(),
    tokenHash: varchar("token_hash", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    ...withCreatedAt(),
  },
  (table) => ({
    tokenHashUk: uniqueIndex("verification_tokens_token_hash_uk").on(table.tokenHash),
    purposeIdx: index("verification_tokens_purpose_idx").on(table.purpose),
  }),
);

export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").notNull(),
    scopeKey: varchar("scope_key", { length: 128 }).notNull().default("global"),
    serviceRegionId: uuid("service_region_id").references(() => serviceRegions.id, {
      onDelete: "set null",
    }),
    ...withCreatedAt(),
  },
  (table) => ({
    uniqueUserRoleScopeUk: uniqueIndex("user_roles_user_role_scope_uk").on(
      table.userId,
      table.role,
      table.scopeKey,
    ),
    roleIdx: index("user_roles_role_idx").on(table.role),
  }),
);

export const parentProfiles = pgTable(
  "parent_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    nickname: varchar("nickname", { length: 120 }),
    homeRegionId: uuid("home_region_id").references(() => serviceRegions.id, {
      onDelete: "set null",
    }),
    preferredRadiusMeters: integer("preferred_radius_meters").notNull().default(3000),
    marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
    ...withTimestamps(),
  },
  (table) => ({
    userIdUk: uniqueIndex("parent_profiles_user_id_uk").on(table.userId),
  }),
);

export const studentProfiles = pgTable(
  "student_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parentUserId: uuid("parent_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 80 }).notNull(),
    gradeBand: varchar("grade_band", { length: 64 }).notNull(),
    birthYear: integer("birth_year"),
    subjectsOfInterest: jsonb("subjects_of_interest")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    notes: text("notes"),
    isActive: boolean("is_active").notNull().default(true),
    ...withTimestamps(),
  },
  (table) => ({
    parentIdx: index("student_profiles_parent_idx").on(table.parentUserId),
  }),
);

export const publicSessions = pgTable(
  "public_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clientFingerprintHash: varchar("client_fingerprint_hash", { length: 128 }),
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    expiresIdx: index("public_sessions_expires_idx").on(table.expiresAt),
  }),
);

export const academyOrganizations = pgTable(
  "academy_organizations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerUserId: uuid("owner_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    legalName: varchar("legal_name", { length: 200 }).notNull(),
    displayName: varchar("display_name", { length: 200 }).notNull(),
    businessRegistrationNumberEncrypted: text("business_registration_number_encrypted"),
    status: organizationStatusEnum("status").notNull().default("active"),
    memo: text("memo"),
    ...withTimestamps(),
  },
  (table) => ({
    displayNameIdx: index("academy_organizations_display_name_idx").on(table.displayName),
    statusIdx: index("academy_organizations_status_idx").on(table.status),
  }),
);

export const academyBranches = pgTable(
  "academy_branches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => academyOrganizations.id, { onDelete: "cascade" }),
    regionId: uuid("region_id")
      .notNull()
      .references(() => serviceRegions.id, { onDelete: "restrict" }),
    displayName: varchar("display_name", { length: 200 }).notNull(),
    roadAddress: varchar("road_address", { length: 300 }).notNull(),
    jibunAddress: varchar("jibun_address", { length: 300 }),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    locationSourceType: locationSourceTypeEnum("location_source_type")
      .notNull()
      .default("academy_self_report"),
    summary: text("summary"),
    description: text("description"),
    ageGroupTags: jsonb("age_group_tags")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    teachingStyleTags: jsonb("teaching_style_tags")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    supportsShuttle: boolean("supports_shuttle").notNull().default(false),
    shuttleNotes: text("shuttle_notes"),
    messageEnabled: boolean("message_enabled").notNull().default(true),
    status: branchStatusEnum("status").notNull().default("draft"),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    lastInfoUpdatedAt: timestamp("last_info_updated_at", { withTimezone: true }),
    ...withTimestamps(),
  },
  (table) => ({
    orgIdx: index("academy_branches_org_idx").on(table.organizationId),
    regionStatusIdx: index("academy_branches_region_status_idx").on(table.regionId, table.status),
    publishedIdx: index("academy_branches_published_idx").on(table.publishedAt),
  }),
);

export const academyStaffMemberships = pgTable(
  "academy_staff_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => academyOrganizations.id, { onDelete: "cascade" }),
    branchId: uuid("branch_id").references(() => academyBranches.id, {
      onDelete: "cascade",
    }),
    scope: staffScopeEnum("scope").notNull().default("organization"),
    staffRole: staffRoleEnum("staff_role").notNull(),
    isPrimary: boolean("is_primary").notNull().default(false),
    ...withCreatedAt(),
  },
  (table) => ({
    userIdx: index("academy_staff_memberships_user_idx").on(table.userId),
    orgIdx: index("academy_staff_memberships_org_idx").on(table.organizationId),
    branchIdx: index("academy_staff_memberships_branch_idx").on(table.branchId),
  }),
);

export const placeSourceMappings = pgTable(
  "place_source_mappings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => academyBranches.id, { onDelete: "cascade" }),
    provider: placeProviderEnum("provider").notNull(),
    providerPlaceId: varchar("provider_place_id", { length: 191 }).notNull(),
    placeNameSnapshot: varchar("place_name_snapshot", { length: 200 }),
    rawPayload: jsonb("raw_payload").$type<Record<string, unknown>>(),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    ...withTimestamps(),
  },
  (table) => ({
    providerPlaceUk: uniqueIndex("place_source_mappings_provider_place_uk").on(
      table.provider,
      table.providerPlaceId,
    ),
    branchProviderUk: uniqueIndex("place_source_mappings_branch_provider_uk").on(
      table.branchId,
      table.provider,
    ),
  }),
);

export const academyClaimRequests = pgTable(
  "academy_claim_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => academyBranches.id, { onDelete: "cascade" }),
    requestedByUserId: uuid("requested_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: claimStatusEnum("status").notNull().default("pending"),
    evidenceNote: text("evidence_note"),
    evidencePayload: jsonb("evidence_payload").$type<Record<string, unknown>>(),
    reviewedByUserId: uuid("reviewed_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    rejectionReason: text("rejection_reason"),
    ...withTimestamps(),
  },
  (table) => ({
    branchStatusIdx: index("academy_claim_requests_branch_status_idx").on(
      table.branchId,
      table.status,
    ),
    requesterIdx: index("academy_claim_requests_requester_idx").on(table.requestedByUserId),
  }),
);

export const programs = pgTable(
  "programs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => academyBranches.id, { onDelete: "cascade" }),
    subject: subjectEnum("subject").notNull(),
    programName: varchar("program_name", { length: 160 }).notNull(),
    gradeBand: varchar("grade_band", { length: 64 }).notNull(),
    deliveryMode: deliveryModeEnum("delivery_mode").notNull().default("offline"),
    monthlyFeeKrw: integer("monthly_fee_krw").notNull(),
    teachingStyles: jsonb("teaching_styles")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    description: text("description"),
    status: programStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...withTimestamps(),
  },
  (table) => ({
    branchIdx: index("programs_branch_idx").on(table.branchId),
    searchIdx: index("programs_branch_subject_grade_status_idx").on(
      table.branchId,
      table.subject,
      table.gradeBand,
      table.status,
    ),
  }),
);

export const classGroups = pgTable(
  "class_groups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    programId: uuid("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 160 }).notNull(),
    maxCapacity: integer("max_capacity").notNull(),
    minOpenThreshold: integer("min_open_threshold").notNull(),
    reportedEnrolledCount: integer("reported_enrolled_count").notNull().default(0),
    waitlistCount: integer("waitlist_count").notNull().default(0),
    reservedCount: integer("reserved_count").notNull().default(0),
    allowWaitlist: boolean("allow_waitlist").notNull().default(true),
    startDate: date("start_date"),
    endDate: date("end_date"),
    status: classGroupStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...withTimestamps(),
  },
  (table) => ({
    programIdx: index("class_groups_program_idx").on(table.programId),
    statusIdx: index("class_groups_status_idx").on(table.status),
  }),
);

export const scheduleRules = pgTable(
  "schedule_rules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classGroupId: uuid("class_group_id")
      .notNull()
      .references(() => classGroups.id, { onDelete: "cascade" }),
    weekday: integer("weekday").notNull(),
    startMinuteOfDay: integer("start_minute_of_day").notNull(),
    endMinuteOfDay: integer("end_minute_of_day").notNull(),
    effectiveFrom: date("effective_from"),
    effectiveTo: date("effective_to"),
    timezone: varchar("timezone", { length: 64 }).notNull().default("Asia/Seoul"),
    ...withTimestamps(),
  },
  (table) => ({
    classWeekdayIdx: index("schedule_rules_class_weekday_idx").on(table.classGroupId, table.weekday),
  }),
);

export const recommendationSessions = pgTable(
  "recommendation_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    publicSessionId: uuid("public_session_id").references(() => publicSessions.id, {
      onDelete: "set null",
    }),
    parentUserId: uuid("parent_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    selectedStudentProfileId: uuid("selected_student_profile_id").references(
      () => studentProfiles.id,
      { onDelete: "set null" },
    ),
    regionId: uuid("region_id")
      .notNull()
      .references(() => serviceRegions.id, { onDelete: "restrict" }),
    requestedLat: doublePrecision("requested_lat").notNull(),
    requestedLng: doublePrecision("requested_lng").notNull(),
    requestedRadiusMeters: integer("requested_radius_meters").notNull(),
    requestedDistanceBasis: distanceBasisEnum("requested_distance_basis")
      .notNull()
      .default("home"),
    needsShuttleSupport: boolean("needs_shuttle_support").notNull().default(false),
    selectedFilters: jsonb("selected_filters")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    freeText: text("free_text"),
    structuredRequirement: jsonb("structured_requirement")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    parserVersion: varchar("parser_version", { length: 32 }).notNull().default("v1"),
    rankingVersion: varchar("ranking_version", { length: 32 }).notNull().default("v1"),
    internalCandidateCount: integer("internal_candidate_count").notNull().default(0),
    returnedCount: integer("returned_count").notNull().default(3),
    ...withCreatedAt(),
  },
  (table) => ({
    publicSessionIdx: index("recommendation_sessions_public_session_idx").on(table.publicSessionId),
    parentIdx: index("recommendation_sessions_parent_idx").on(table.parentUserId),
    regionIdx: index("recommendation_sessions_region_idx").on(table.regionId),
  }),
);

export const recommendationResults = pgTable(
  "recommendation_results",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => recommendationSessions.id, { onDelete: "cascade" }),
    rank: integer("rank").notNull(),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => academyBranches.id, { onDelete: "restrict" }),
    programId: uuid("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "restrict" }),
    classGroupId: uuid("class_group_id")
      .notNull()
      .references(() => classGroups.id, { onDelete: "restrict" }),
    status: recommendationStatusEnum("status").notNull(),
    score: doublePrecision("score").notNull(),
    reasonCodes: jsonb("reason_codes")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    warnings: jsonb("warnings")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    explanation: text("explanation"),
    distanceBasis: distanceBasisEnum("distance_basis").notNull().default("home"),
    distanceMeters: integer("distance_meters"),
    supportsShuttle: boolean("supports_shuttle").notNull().default(false),
    monthlyFeeKrwSnapshot: integer("monthly_fee_krw_snapshot"),
    scheduleSummarySnapshot: jsonb("schedule_summary_snapshot")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    returnedToUser: boolean("returned_to_user").notNull().default(false),
    ...withCreatedAt(),
  },
  (table) => ({
    sessionRankUk: uniqueIndex("recommendation_results_session_rank_uk").on(table.sessionId, table.rank),
    sessionClassUk: uniqueIndex("recommendation_results_session_class_uk").on(
      table.sessionId,
      table.classGroupId,
    ),
    sessionReturnedIdx: index("recommendation_results_session_returned_idx").on(
      table.sessionId,
      table.returnedToUser,
      table.rank,
    ),
  }),
);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parentUserId: uuid("parent_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => academyBranches.id, { onDelete: "cascade" }),
    recommendationSessionId: uuid("recommendation_session_id").references(
      () => recommendationSessions.id,
      { onDelete: "set null" },
    ),
    recommendationResultId: uuid("recommendation_result_id").references(
      () => recommendationResults.id,
      { onDelete: "set null" },
    ),
    assignedStaffUserId: uuid("assigned_staff_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    status: conversationStatusEnum("status").notNull().default("open"),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
    ...withTimestamps(),
  },
  (table) => ({
    parentIdx: index("conversations_parent_idx").on(table.parentUserId),
    branchIdx: index("conversations_branch_idx").on(table.branchId),
    statusIdx: index("conversations_status_idx").on(table.status),
  }),
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderType: senderTypeEnum("sender_type").notNull(),
    senderUserId: uuid("sender_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    body: text("body").notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    readAt: timestamp("read_at", { withTimezone: true }),
    ...withCreatedAt(),
  },
  (table) => ({
    conversationCreatedIdx: index("messages_conversation_created_idx").on(
      table.conversationId,
      table.createdAt,
    ),
  }),
);

export const academyBranchVersions = pgTable(
  "academy_branch_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => academyBranches.id, { onDelete: "cascade" }),
    versionNo: integer("version_no").notNull(),
    snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
    reason: text("reason"),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...withCreatedAt(),
  },
  (table) => ({
    branchVersionUk: uniqueIndex("academy_branch_versions_branch_version_uk").on(
      table.branchId,
      table.versionNo,
    ),
  }),
);

export const programVersions = pgTable(
  "program_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    programId: uuid("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    versionNo: integer("version_no").notNull(),
    snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
    reason: text("reason"),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...withCreatedAt(),
  },
  (table) => ({
    programVersionUk: uniqueIndex("program_versions_program_version_uk").on(
      table.programId,
      table.versionNo,
    ),
  }),
);

export const classGroupVersions = pgTable(
  "class_group_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classGroupId: uuid("class_group_id")
      .notNull()
      .references(() => classGroups.id, { onDelete: "cascade" }),
    versionNo: integer("version_no").notNull(),
    snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
    reason: text("reason"),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...withCreatedAt(),
  },
  (table) => ({
    classGroupVersionUk: uniqueIndex("class_group_versions_class_group_version_uk").on(
      table.classGroupId,
      table.versionNo,
    ),
  }),
);

export const scheduleRuleVersions = pgTable(
  "schedule_rule_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    scheduleRuleId: uuid("schedule_rule_id")
      .notNull()
      .references(() => scheduleRules.id, { onDelete: "cascade" }),
    versionNo: integer("version_no").notNull(),
    snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
    reason: text("reason"),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...withCreatedAt(),
  },
  (table) => ({
    scheduleRuleVersionUk: uniqueIndex("schedule_rule_versions_schedule_rule_version_uk").on(
      table.scheduleRuleId,
      table.versionNo,
    ),
  }),
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: uuid("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    actorRole: userRoleEnum("actor_role"),
    entityType: auditEntityTypeEnum("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    action: auditActionEnum("action").notNull(),
    reason: text("reason"),
    changeSet: jsonb("change_set").$type<Record<string, unknown>>(),
    snapshotAfter: jsonb("snapshot_after").$type<Record<string, unknown>>(),
    requestId: varchar("request_id", { length: 128 }),
    ipHash: varchar("ip_hash", { length: 128 }),
    userAgent: text("user_agent"),
    ...withCreatedAt(),
  },
  (table) => ({
    entityIdx: index("audit_events_entity_idx").on(table.entityType, table.entityId),
    actorIdx: index("audit_events_actor_idx").on(table.actorUserId),
    createdIdx: index("audit_events_created_idx").on(table.createdAt),
  }),
);

export const billingProducts = pgTable(
  "billing_products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 64 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    description: text("description"),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    ...withTimestamps(),
  },
  (table) => ({
    codeUk: uniqueIndex("billing_products_code_uk").on(table.code),
  }),
);

export const billingPlans = pgTable(
  "billing_plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => billingProducts.id, { onDelete: "cascade" }),
    code: varchar("code", { length: 64 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    billingInterval: billingIntervalEnum("billing_interval").notNull(),
    priceKrw: integer("price_krw").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    ...withTimestamps(),
  },
  (table) => ({
    codeUk: uniqueIndex("billing_plans_code_uk").on(table.code),
    productIdx: index("billing_plans_product_idx").on(table.productId),
  }),
);

export const paymentOrders = pgTable(
  "payment_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    payerUserId: uuid("payer_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    payerOrganizationId: uuid("payer_organization_id").references(
      () => academyOrganizations.id,
      { onDelete: "set null" },
    ),
    productId: uuid("product_id").references(() => billingProducts.id, {
      onDelete: "set null",
    }),
    planId: uuid("plan_id").references(() => billingPlans.id, {
      onDelete: "set null",
    }),
    provider: varchar("provider", { length: 40 }).notNull().default("toss_payments"),
    providerOrderId: varchar("provider_order_id", { length: 128 }).notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    amountKrw: integer("amount_krw").notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    ...withTimestamps(),
  },
  (table) => ({
    providerOrderIdUk: uniqueIndex("payment_orders_provider_order_id_uk").on(table.providerOrderId),
    payerOrgIdx: index("payment_orders_payer_org_idx").on(table.payerOrganizationId),
    statusIdx: index("payment_orders_status_idx").on(table.status),
  }),
);

export const paymentTransactions = pgTable(
  "payment_transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => paymentOrders.id, { onDelete: "cascade" }),
    providerPaymentKey: varchar("provider_payment_key", { length: 191 }),
    status: paymentStatusEnum("status").notNull(),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    rawPayload: jsonb("raw_payload")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    ...withCreatedAt(),
  },
  (table) => ({
    providerPaymentKeyUk: uniqueIndex("payment_transactions_provider_payment_key_uk").on(
      table.providerPaymentKey,
    ),
    orderIdx: index("payment_transactions_order_idx").on(table.orderId),
  }),
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => academyOrganizations.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => billingPlans.id, { onDelete: "restrict" }),
    status: subscriptionStatusEnum("status").notNull().default("trialing"),
    providerBillingKeyEncrypted: text("provider_billing_key_encrypted"),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    ...withTimestamps(),
  },
  (table) => ({
    orgIdx: index("subscriptions_org_idx").on(table.organizationId),
    statusIdx: index("subscriptions_status_idx").on(table.status),
  }),
);

export const schema = {
  serviceRegions,
  users,
  passwordCredentials,
  authSessions,
  verificationTokens,
  userRoles,
  parentProfiles,
  studentProfiles,
  publicSessions,
  academyOrganizations,
  academyBranches,
  academyStaffMemberships,
  placeSourceMappings,
  academyClaimRequests,
  programs,
  classGroups,
  scheduleRules,
  recommendationSessions,
  recommendationResults,
  conversations,
  messages,
  academyBranchVersions,
  programVersions,
  classGroupVersions,
  scheduleRuleVersions,
  auditEvents,
  billingProducts,
  billingPlans,
  paymentOrders,
  paymentTransactions,
  subscriptions,
};
