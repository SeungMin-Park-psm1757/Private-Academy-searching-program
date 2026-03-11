CREATE TYPE "public"."audit_action" AS ENUM('create', 'update', 'delete', 'publish', 'suspend', 'approve', 'reject', 'rollback');--> statement-breakpoint
CREATE TYPE "public"."audit_entity_type" AS ENUM('service_region', 'academy_organization', 'academy_branch', 'academy_claim_request', 'program', 'class_group', 'schedule_rule', 'conversation', 'message', 'billing_plan', 'subscription', 'user_role');--> statement-breakpoint
CREATE TYPE "public"."auth_provider" AS ENUM('credentials', 'google', 'kakao');--> statement-breakpoint
CREATE TYPE "public"."billing_interval" AS ENUM('one_time', 'month', 'year');--> statement-breakpoint
CREATE TYPE "public"."branch_status" AS ENUM('draft', 'pending_review', 'published', 'suspended', 'archived');--> statement-breakpoint
CREATE TYPE "public"."claim_status" AS ENUM('pending', 'approved', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."class_group_status" AS ENUM('draft', 'published', 'paused', 'archived');--> statement-breakpoint
CREATE TYPE "public"."conversation_status" AS ENUM('open', 'closed', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."delivery_mode" AS ENUM('offline', 'online', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."distance_basis" AS ENUM('home', 'school');--> statement-breakpoint
CREATE TYPE "public"."location_source_type" AS ENUM('kakao_seed', 'academy_self_report', 'admin_verified', 'system_derived');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'failed', 'canceled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."organization_status" AS ENUM('active', 'suspended', 'archived');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('requested', 'authorized', 'done', 'failed', 'canceled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."place_provider" AS ENUM('kakao_local', 'manual', 'other');--> statement-breakpoint
CREATE TYPE "public"."program_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."recommendation_status" AS ENUM('open', 'waitlist_only', 'closed');--> statement-breakpoint
CREATE TYPE "public"."sender_type" AS ENUM('parent', 'academy_staff', 'admin', 'system');--> statement-breakpoint
CREATE TYPE "public"."staff_role" AS ENUM('owner', 'editor', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."staff_scope" AS ENUM('organization', 'branch');--> statement-breakpoint
CREATE TYPE "public"."subject" AS ENUM('math', 'english', 'korean', 'science', 'coding', 'essay', 'social_studies', 'other');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('trialing', 'active', 'past_due', 'canceled', 'paused', 'expired');--> statement-breakpoint
CREATE TYPE "public"."token_purpose" AS ENUM('email_verify', 'password_reset', 'invite');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('parent', 'academy_editor', 'academy_owner', 'platform_reviewer', 'platform_admin', 'support_readonly');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'invited', 'suspended', 'deleted');--> statement-breakpoint
CREATE TABLE "academy_branch_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"branch_id" uuid NOT NULL,
	"version_no" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"reason" text,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"region_id" uuid NOT NULL,
	"display_name" varchar(200) NOT NULL,
	"road_address" varchar(300) NOT NULL,
	"jibun_address" varchar(300),
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"location_source_type" "location_source_type" DEFAULT 'academy_self_report' NOT NULL,
	"summary" text,
	"description" text,
	"age_group_tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"teaching_style_tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"supports_shuttle" boolean DEFAULT false NOT NULL,
	"shuttle_notes" text,
	"message_enabled" boolean DEFAULT true NOT NULL,
	"status" "branch_status" DEFAULT 'draft' NOT NULL,
	"verified_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"last_info_updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_claim_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"branch_id" uuid NOT NULL,
	"requested_by_user_id" uuid NOT NULL,
	"status" "claim_status" DEFAULT 'pending' NOT NULL,
	"evidence_note" text,
	"evidence_payload" jsonb,
	"reviewed_by_user_id" uuid,
	"reviewed_at" timestamp with time zone,
	"rejection_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_user_id" uuid,
	"legal_name" varchar(200) NOT NULL,
	"display_name" varchar(200) NOT NULL,
	"business_registration_number_encrypted" text,
	"status" "organization_status" DEFAULT 'active' NOT NULL,
	"memo" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academy_staff_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"branch_id" uuid,
	"scope" "staff_scope" DEFAULT 'organization' NOT NULL,
	"staff_role" "staff_role" NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"actor_role" "user_role",
	"entity_type" "audit_entity_type" NOT NULL,
	"entity_id" uuid NOT NULL,
	"action" "audit_action" NOT NULL,
	"reason" text,
	"change_set" jsonb,
	"snapshot_after" jsonb,
	"request_id" varchar(128),
	"ip_hash" varchar(128),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"ip_hash" varchar(128),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"code" varchar(64) NOT NULL,
	"name" varchar(160) NOT NULL,
	"billing_interval" "billing_interval" NOT NULL,
	"price_krw" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(64) NOT NULL,
	"name" varchar(160) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_group_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_group_id" uuid NOT NULL,
	"version_no" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"reason" text,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" uuid NOT NULL,
	"name" varchar(160) NOT NULL,
	"max_capacity" integer NOT NULL,
	"min_open_threshold" integer NOT NULL,
	"reported_enrolled_count" integer DEFAULT 0 NOT NULL,
	"waitlist_count" integer DEFAULT 0 NOT NULL,
	"reserved_count" integer DEFAULT 0 NOT NULL,
	"allow_waitlist" boolean DEFAULT true NOT NULL,
	"start_date" date,
	"end_date" date,
	"status" "class_group_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_user_id" uuid NOT NULL,
	"branch_id" uuid NOT NULL,
	"recommendation_session_id" uuid,
	"recommendation_result_id" uuid,
	"assigned_staff_user_id" uuid,
	"status" "conversation_status" DEFAULT 'open' NOT NULL,
	"last_message_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender_type" "sender_type" NOT NULL,
	"sender_user_id" uuid,
	"body" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parent_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"nickname" varchar(120),
	"home_region_id" uuid,
	"preferred_radius_meters" integer DEFAULT 3000 NOT NULL,
	"marketing_opt_in" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"password_hash" text NOT NULL,
	"password_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payer_user_id" uuid,
	"payer_organization_id" uuid,
	"product_id" uuid,
	"plan_id" uuid,
	"provider" varchar(40) DEFAULT 'toss_payments' NOT NULL,
	"provider_order_id" varchar(128) NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"amount_krw" integer NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"provider_payment_key" varchar(191),
	"status" "payment_status" NOT NULL,
	"approved_at" timestamp with time zone,
	"raw_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "place_source_mappings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"branch_id" uuid NOT NULL,
	"provider" "place_provider" NOT NULL,
	"provider_place_id" varchar(191) NOT NULL,
	"place_name_snapshot" varchar(200),
	"raw_payload" jsonb,
	"last_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" uuid NOT NULL,
	"version_no" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"reason" text,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"branch_id" uuid NOT NULL,
	"subject" "subject" NOT NULL,
	"program_name" varchar(160) NOT NULL,
	"grade_band" varchar(64) NOT NULL,
	"delivery_mode" "delivery_mode" DEFAULT 'offline' NOT NULL,
	"monthly_fee_krw" integer NOT NULL,
	"teaching_styles" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"description" text,
	"status" "program_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_fingerprint_hash" varchar(128),
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recommendation_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"rank" integer NOT NULL,
	"branch_id" uuid NOT NULL,
	"program_id" uuid NOT NULL,
	"class_group_id" uuid NOT NULL,
	"status" "recommendation_status" NOT NULL,
	"score" double precision NOT NULL,
	"reason_codes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"warnings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"explanation" text,
	"distance_basis" "distance_basis" DEFAULT 'home' NOT NULL,
	"distance_meters" integer,
	"supports_shuttle" boolean DEFAULT false NOT NULL,
	"monthly_fee_krw_snapshot" integer,
	"schedule_summary_snapshot" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"returned_to_user" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recommendation_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_session_id" uuid,
	"parent_user_id" uuid,
	"selected_student_profile_id" uuid,
	"region_id" uuid NOT NULL,
	"requested_lat" double precision NOT NULL,
	"requested_lng" double precision NOT NULL,
	"requested_radius_meters" integer NOT NULL,
	"requested_distance_basis" "distance_basis" DEFAULT 'home' NOT NULL,
	"needs_shuttle_support" boolean DEFAULT false NOT NULL,
	"selected_filters" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"free_text" text,
	"structured_requirement" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"parser_version" varchar(32) DEFAULT 'v1' NOT NULL,
	"ranking_version" varchar(32) DEFAULT 'v1' NOT NULL,
	"internal_candidate_count" integer DEFAULT 0 NOT NULL,
	"returned_count" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedule_rule_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schedule_rule_id" uuid NOT NULL,
	"version_no" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"reason" text,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedule_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_group_id" uuid NOT NULL,
	"weekday" integer NOT NULL,
	"start_minute_of_day" integer NOT NULL,
	"end_minute_of_day" integer NOT NULL,
	"effective_from" date,
	"effective_to" date,
	"timezone" varchar(64) DEFAULT 'Asia/Seoul' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_regions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(64) NOT NULL,
	"name" varchar(120) NOT NULL,
	"city" varchar(80) NOT NULL,
	"district" varchar(80),
	"center_lat" double precision,
	"center_lng" double precision,
	"default_radius_meters" integer DEFAULT 3000 NOT NULL,
	"geo_json" jsonb,
	"is_launch_region" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_user_id" uuid NOT NULL,
	"label" varchar(80) NOT NULL,
	"grade_band" varchar(64) NOT NULL,
	"birth_year" integer,
	"subjects_of_interest" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"notes" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"status" "subscription_status" DEFAULT 'trialing' NOT NULL,
	"provider_billing_key_encrypted" text,
	"current_period_start" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "user_role" NOT NULL,
	"scope_key" varchar(128) DEFAULT 'global' NOT NULL,
	"service_region_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"email_verified_at" timestamp with time zone,
	"display_name" varchar(120),
	"phone_e164" varchar(32),
	"auth_provider" "auth_provider" DEFAULT 'credentials' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"purpose" "token_purpose" NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "academy_branch_versions" ADD CONSTRAINT "academy_branch_versions_branch_id_academy_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."academy_branches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_branch_versions" ADD CONSTRAINT "academy_branch_versions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_branches" ADD CONSTRAINT "academy_branches_organization_id_academy_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."academy_organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_branches" ADD CONSTRAINT "academy_branches_region_id_service_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."service_regions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_claim_requests" ADD CONSTRAINT "academy_claim_requests_branch_id_academy_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."academy_branches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_claim_requests" ADD CONSTRAINT "academy_claim_requests_requested_by_user_id_users_id_fk" FOREIGN KEY ("requested_by_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_claim_requests" ADD CONSTRAINT "academy_claim_requests_reviewed_by_user_id_users_id_fk" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_organizations" ADD CONSTRAINT "academy_organizations_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_staff_memberships" ADD CONSTRAINT "academy_staff_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_staff_memberships" ADD CONSTRAINT "academy_staff_memberships_organization_id_academy_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."academy_organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "academy_staff_memberships" ADD CONSTRAINT "academy_staff_memberships_branch_id_academy_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."academy_branches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_plans" ADD CONSTRAINT "billing_plans_product_id_billing_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."billing_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_group_versions" ADD CONSTRAINT "class_group_versions_class_group_id_class_groups_id_fk" FOREIGN KEY ("class_group_id") REFERENCES "public"."class_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_group_versions" ADD CONSTRAINT "class_group_versions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_groups" ADD CONSTRAINT "class_groups_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_parent_user_id_users_id_fk" FOREIGN KEY ("parent_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_branch_id_academy_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."academy_branches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_recommendation_session_id_recommendation_sessions_id_fk" FOREIGN KEY ("recommendation_session_id") REFERENCES "public"."recommendation_sessions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_recommendation_result_id_recommendation_results_id_fk" FOREIGN KEY ("recommendation_result_id") REFERENCES "public"."recommendation_results"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_assigned_staff_user_id_users_id_fk" FOREIGN KEY ("assigned_staff_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_user_id_users_id_fk" FOREIGN KEY ("sender_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_profiles" ADD CONSTRAINT "parent_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_profiles" ADD CONSTRAINT "parent_profiles_home_region_id_service_regions_id_fk" FOREIGN KEY ("home_region_id") REFERENCES "public"."service_regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_credentials" ADD CONSTRAINT "password_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_payer_user_id_users_id_fk" FOREIGN KEY ("payer_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_payer_organization_id_academy_organizations_id_fk" FOREIGN KEY ("payer_organization_id") REFERENCES "public"."academy_organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_product_id_billing_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."billing_products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_plan_id_billing_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."billing_plans"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_order_id_payment_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."payment_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_source_mappings" ADD CONSTRAINT "place_source_mappings_branch_id_academy_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."academy_branches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_versions" ADD CONSTRAINT "program_versions_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_versions" ADD CONSTRAINT "program_versions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_branch_id_academy_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."academy_branches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_results" ADD CONSTRAINT "recommendation_results_session_id_recommendation_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."recommendation_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_results" ADD CONSTRAINT "recommendation_results_branch_id_academy_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."academy_branches"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_results" ADD CONSTRAINT "recommendation_results_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_results" ADD CONSTRAINT "recommendation_results_class_group_id_class_groups_id_fk" FOREIGN KEY ("class_group_id") REFERENCES "public"."class_groups"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_sessions" ADD CONSTRAINT "recommendation_sessions_public_session_id_public_sessions_id_fk" FOREIGN KEY ("public_session_id") REFERENCES "public"."public_sessions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_sessions" ADD CONSTRAINT "recommendation_sessions_parent_user_id_users_id_fk" FOREIGN KEY ("parent_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_sessions" ADD CONSTRAINT "recommendation_sessions_selected_student_profile_id_student_profiles_id_fk" FOREIGN KEY ("selected_student_profile_id") REFERENCES "public"."student_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_sessions" ADD CONSTRAINT "recommendation_sessions_region_id_service_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."service_regions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_rule_versions" ADD CONSTRAINT "schedule_rule_versions_schedule_rule_id_schedule_rules_id_fk" FOREIGN KEY ("schedule_rule_id") REFERENCES "public"."schedule_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_rule_versions" ADD CONSTRAINT "schedule_rule_versions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_rules" ADD CONSTRAINT "schedule_rules_class_group_id_class_groups_id_fk" FOREIGN KEY ("class_group_id") REFERENCES "public"."class_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_parent_user_id_users_id_fk" FOREIGN KEY ("parent_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_organization_id_academy_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."academy_organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_billing_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."billing_plans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_service_region_id_service_regions_id_fk" FOREIGN KEY ("service_region_id") REFERENCES "public"."service_regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "academy_branch_versions_branch_version_uk" ON "academy_branch_versions" USING btree ("branch_id","version_no");--> statement-breakpoint
CREATE INDEX "academy_branches_org_idx" ON "academy_branches" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "academy_branches_region_status_idx" ON "academy_branches" USING btree ("region_id","status");--> statement-breakpoint
CREATE INDEX "academy_branches_published_idx" ON "academy_branches" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "academy_claim_requests_branch_status_idx" ON "academy_claim_requests" USING btree ("branch_id","status");--> statement-breakpoint
CREATE INDEX "academy_claim_requests_requester_idx" ON "academy_claim_requests" USING btree ("requested_by_user_id");--> statement-breakpoint
CREATE INDEX "academy_organizations_display_name_idx" ON "academy_organizations" USING btree ("display_name");--> statement-breakpoint
CREATE INDEX "academy_organizations_status_idx" ON "academy_organizations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "academy_staff_memberships_user_idx" ON "academy_staff_memberships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "academy_staff_memberships_org_idx" ON "academy_staff_memberships" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "academy_staff_memberships_branch_idx" ON "academy_staff_memberships" USING btree ("branch_id");--> statement-breakpoint
CREATE INDEX "audit_events_entity_idx" ON "audit_events" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_events_actor_idx" ON "audit_events" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX "audit_events_created_idx" ON "audit_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "auth_sessions_user_idx" ON "auth_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_sessions_expires_idx" ON "auth_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_plans_code_uk" ON "billing_plans" USING btree ("code");--> statement-breakpoint
CREATE INDEX "billing_plans_product_idx" ON "billing_plans" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_products_code_uk" ON "billing_products" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "class_group_versions_class_group_version_uk" ON "class_group_versions" USING btree ("class_group_id","version_no");--> statement-breakpoint
CREATE INDEX "class_groups_program_idx" ON "class_groups" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "class_groups_status_idx" ON "class_groups" USING btree ("status");--> statement-breakpoint
CREATE INDEX "conversations_parent_idx" ON "conversations" USING btree ("parent_user_id");--> statement-breakpoint
CREATE INDEX "conversations_branch_idx" ON "conversations" USING btree ("branch_id");--> statement-breakpoint
CREATE INDEX "conversations_status_idx" ON "conversations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "messages_conversation_created_idx" ON "messages" USING btree ("conversation_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "parent_profiles_user_id_uk" ON "parent_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "password_credentials_user_id_uk" ON "password_credentials" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_orders_provider_order_id_uk" ON "payment_orders" USING btree ("provider_order_id");--> statement-breakpoint
CREATE INDEX "payment_orders_payer_org_idx" ON "payment_orders" USING btree ("payer_organization_id");--> statement-breakpoint
CREATE INDEX "payment_orders_status_idx" ON "payment_orders" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_transactions_provider_payment_key_uk" ON "payment_transactions" USING btree ("provider_payment_key");--> statement-breakpoint
CREATE INDEX "payment_transactions_order_idx" ON "payment_transactions" USING btree ("order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "place_source_mappings_provider_place_uk" ON "place_source_mappings" USING btree ("provider","provider_place_id");--> statement-breakpoint
CREATE UNIQUE INDEX "place_source_mappings_branch_provider_uk" ON "place_source_mappings" USING btree ("branch_id","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "program_versions_program_version_uk" ON "program_versions" USING btree ("program_id","version_no");--> statement-breakpoint
CREATE INDEX "programs_branch_idx" ON "programs" USING btree ("branch_id");--> statement-breakpoint
CREATE INDEX "programs_branch_subject_grade_status_idx" ON "programs" USING btree ("branch_id","subject","grade_band","status");--> statement-breakpoint
CREATE INDEX "public_sessions_expires_idx" ON "public_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "recommendation_results_session_rank_uk" ON "recommendation_results" USING btree ("session_id","rank");--> statement-breakpoint
CREATE UNIQUE INDEX "recommendation_results_session_class_uk" ON "recommendation_results" USING btree ("session_id","class_group_id");--> statement-breakpoint
CREATE INDEX "recommendation_results_session_returned_idx" ON "recommendation_results" USING btree ("session_id","returned_to_user","rank");--> statement-breakpoint
CREATE INDEX "recommendation_sessions_public_session_idx" ON "recommendation_sessions" USING btree ("public_session_id");--> statement-breakpoint
CREATE INDEX "recommendation_sessions_parent_idx" ON "recommendation_sessions" USING btree ("parent_user_id");--> statement-breakpoint
CREATE INDEX "recommendation_sessions_region_idx" ON "recommendation_sessions" USING btree ("region_id");--> statement-breakpoint
CREATE UNIQUE INDEX "schedule_rule_versions_schedule_rule_version_uk" ON "schedule_rule_versions" USING btree ("schedule_rule_id","version_no");--> statement-breakpoint
CREATE INDEX "schedule_rules_class_weekday_idx" ON "schedule_rules" USING btree ("class_group_id","weekday");--> statement-breakpoint
CREATE UNIQUE INDEX "service_regions_code_uk" ON "service_regions" USING btree ("code");--> statement-breakpoint
CREATE INDEX "service_regions_active_idx" ON "service_regions" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "student_profiles_parent_idx" ON "student_profiles" USING btree ("parent_user_id");--> statement-breakpoint
CREATE INDEX "subscriptions_org_idx" ON "subscriptions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "subscriptions_status_idx" ON "subscriptions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_user_role_scope_uk" ON "user_roles" USING btree ("user_id","role","scope_key");--> statement-breakpoint
CREATE INDEX "user_roles_role_idx" ON "user_roles" USING btree ("role");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_uk" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "verification_tokens_token_hash_uk" ON "verification_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "verification_tokens_purpose_idx" ON "verification_tokens" USING btree ("purpose");