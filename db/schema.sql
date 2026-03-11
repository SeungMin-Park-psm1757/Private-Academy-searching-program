CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE service_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_code TEXT NOT NULL UNIQUE,
  city_name TEXT NOT NULL,
  district_name TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_launch_region BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  display_name TEXT,
  user_status TEXT NOT NULL DEFAULT 'active'
    CHECK (user_status IN ('active', 'invited', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  role TEXT NOT NULL
    CHECK (role IN (
      'parent_member',
      'academy_editor',
      'academy_owner',
      'platform_reviewer',
      'platform_admin',
      'support_readonly'
    )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE parent_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  phone TEXT,
  marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id UUID NOT NULL REFERENCES users(id),
  nickname TEXT,
  grade_band TEXT NOT NULL,
  birth_year INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID REFERENCES service_regions(id),
  anonymous_token_hash TEXT NOT NULL UNIQUE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE academy_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  organization_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (organization_status IN ('draft', 'active', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE academy_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES academy_organizations(id),
  service_region_id UUID NOT NULL REFERENCES service_regions(id),
  name TEXT NOT NULL,
  admin_dong TEXT,
  address_line1 TEXT,
  postal_code TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone TEXT,
  description TEXT,
  supports_shuttle BOOLEAN NOT NULL DEFAULT FALSE,
  shuttle_notes TEXT,
  review_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (review_status IN ('draft', 'pending_review', 'published', 'suspended')),
  source_type TEXT NOT NULL DEFAULT 'academy_self_report'
    CHECK (source_type IN (
      'academy_self_report',
      'admin_verified',
      'external_enrichment',
      'system_derived'
    )),
  verified_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  last_data_refresh_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE academy_staff_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES academy_organizations(id),
  branch_id UUID REFERENCES academy_branches(id),
  user_id UUID NOT NULL REFERENCES users(id),
  membership_role TEXT NOT NULL
    CHECK (membership_role IN ('academy_editor', 'academy_owner')),
  membership_status TEXT NOT NULL DEFAULT 'active'
    CHECK (membership_status IN ('active', 'invited', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE academy_claim_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES academy_branches(id),
  requested_by_user_id UUID NOT NULL REFERENCES users(id),
  evidence_note TEXT,
  claim_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (claim_status IN ('pending', 'approved', 'rejected', 'cancelled')),
  reviewed_by_user_id UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE place_source_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES academy_branches(id),
  provider TEXT NOT NULL
    CHECK (provider IN ('kakao_local')),
  external_place_id TEXT NOT NULL,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, external_place_id)
);

CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES academy_branches(id),
  subject TEXT NOT NULL,
  grade_band TEXT NOT NULL,
  monthly_fee_krw INT CHECK (monthly_fee_krw >= 0),
  delivery_mode TEXT NOT NULL DEFAULT 'offline'
    CHECK (delivery_mode IN ('offline', 'hybrid', 'online')),
  teaching_style_tags TEXT[] NOT NULL DEFAULT '{}',
  program_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (program_status IN ('draft', 'pending_review', 'published', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE class_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id),
  name TEXT NOT NULL,
  max_capacity INT NOT NULL CHECK (max_capacity > 0),
  min_open_threshold INT NOT NULL DEFAULT 0 CHECK (min_open_threshold >= 0),
  reported_enrolled_count INT NOT NULL DEFAULT 0 CHECK (reported_enrolled_count >= 0),
  reserved_count INT NOT NULL DEFAULT 0 CHECK (reserved_count >= 0),
  waitlist_count INT NOT NULL DEFAULT 0 CHECK (waitlist_count >= 0),
  class_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (class_status IN ('draft', 'published', 'suspended')),
  accepts_waitlist BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (min_open_threshold <= max_capacity),
  CHECK (reported_enrolled_count <= max_capacity)
);

CREATE TABLE schedule_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_group_id UUID NOT NULL REFERENCES class_groups(id),
  weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 1 AND 7),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  valid_from DATE,
  valid_to DATE,
  timezone TEXT NOT NULL DEFAULT 'Asia/Seoul',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_time > start_time),
  CHECK (valid_to IS NULL OR valid_from IS NULL OR valid_to >= valid_from)
);

CREATE TABLE recommendation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_session_id UUID REFERENCES public_sessions(id),
  parent_user_id UUID REFERENCES users(id),
  region_id UUID NOT NULL REFERENCES service_regions(id),
  free_text_input TEXT,
  structured_requirement JSONB NOT NULL,
  asked_follow_up_question BOOLEAN NOT NULL DEFAULT FALSE,
  top_n_internal SMALLINT NOT NULL DEFAULT 20,
  public_result_limit SMALLINT NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE recommendation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES recommendation_sessions(id),
  class_group_id UUID NOT NULL REFERENCES class_groups(id),
  academy_branch_id UUID NOT NULL REFERENCES academy_branches(id),
  rank_position INT NOT NULL CHECK (rank_position > 0),
  score NUMERIC(5, 2) NOT NULL,
  distance_basis TEXT
    CHECK (distance_basis IN ('home', 'school')),
  selected_distance_km NUMERIC(5, 2),
  supports_shuttle BOOLEAN NOT NULL DEFAULT FALSE,
  result_status TEXT NOT NULL
    CHECK (result_status IN ('open', 'waitlist_only', 'closed')),
  reason_codes TEXT[] NOT NULL DEFAULT '{}',
  warning_codes TEXT[] NOT NULL DEFAULT '{}',
  explanation TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, rank_position),
  UNIQUE (session_id, class_group_id)
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_session_id UUID REFERENCES recommendation_sessions(id),
  parent_user_id UUID NOT NULL REFERENCES users(id),
  academy_branch_id UUID NOT NULL REFERENCES academy_branches(id),
  conversation_status TEXT NOT NULL DEFAULT 'open'
    CHECK (conversation_status IN ('open', 'closed', 'blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  sender_user_id UUID REFERENCES users(id),
  sender_kind TEXT NOT NULL
    CHECK (sender_kind IN ('parent', 'academy_staff', 'platform_admin', 'system')),
  body TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE billing_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  product_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (product_status IN ('draft', 'active', 'retired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE billing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES billing_products(id),
  plan_code TEXT NOT NULL UNIQUE,
  billing_kind TEXT NOT NULL
    CHECK (billing_kind IN ('one_time', 'subscription')),
  interval_months INT,
  amount_krw INT NOT NULL CHECK (amount_krw >= 0),
  is_feature_flagged BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (
    (billing_kind = 'one_time' AND interval_months IS NULL) OR
    (billing_kind = 'subscription' AND interval_months IS NOT NULL AND interval_months > 0)
  )
);

CREATE TABLE payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  buyer_user_id UUID REFERENCES users(id),
  academy_organization_id UUID REFERENCES academy_organizations(id),
  plan_id UUID REFERENCES billing_plans(id),
  order_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (order_status IN ('pending', 'paid', 'cancelled', 'failed', 'refunded')),
  amount_krw INT NOT NULL CHECK (amount_krw >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES payment_orders(id),
  provider TEXT NOT NULL
    CHECK (provider IN ('toss_payments')),
  provider_payment_key TEXT UNIQUE,
  transaction_status TEXT NOT NULL
    CHECK (transaction_status IN ('ready', 'done', 'cancelled', 'failed', 'refunded')),
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES billing_plans(id),
  academy_organization_id UUID NOT NULL REFERENCES academy_organizations(id),
  subscription_status TEXT NOT NULL
    CHECK (subscription_status IN ('trialing', 'active', 'paused', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id),
  actor_role TEXT,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  summary TEXT,
  diff JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE academy_branch_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES academy_branches(id),
  version_number INT NOT NULL,
  snapshot JSONB NOT NULL,
  created_by_user_id UUID REFERENCES users(id),
  audit_event_id UUID REFERENCES audit_events(id),
  rollback_of_version_id UUID REFERENCES academy_branch_versions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (branch_id, version_number)
);

CREATE TABLE program_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id),
  version_number INT NOT NULL,
  snapshot JSONB NOT NULL,
  created_by_user_id UUID REFERENCES users(id),
  audit_event_id UUID REFERENCES audit_events(id),
  rollback_of_version_id UUID REFERENCES program_versions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (program_id, version_number)
);

CREATE TABLE class_group_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_group_id UUID NOT NULL REFERENCES class_groups(id),
  version_number INT NOT NULL,
  snapshot JSONB NOT NULL,
  created_by_user_id UUID REFERENCES users(id),
  audit_event_id UUID REFERENCES audit_events(id),
  rollback_of_version_id UUID REFERENCES class_group_versions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (class_group_id, version_number)
);

CREATE TABLE schedule_rule_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_rule_id UUID NOT NULL REFERENCES schedule_rules(id),
  version_number INT NOT NULL,
  snapshot JSONB NOT NULL,
  created_by_user_id UUID REFERENCES users(id),
  audit_event_id UUID REFERENCES audit_events(id),
  rollback_of_version_id UUID REFERENCES schedule_rule_versions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (schedule_rule_id, version_number)
);

CREATE INDEX idx_academy_branches_region_status
  ON academy_branches (service_region_id, review_status);

CREATE INDEX idx_programs_branch_subject_grade
  ON programs (branch_id, subject, grade_band);

CREATE INDEX idx_class_groups_program_status
  ON class_groups (program_id, class_status);

CREATE INDEX idx_schedule_rules_class_weekday
  ON schedule_rules (class_group_id, weekday);

CREATE INDEX idx_recommendation_results_session_rank
  ON recommendation_results (session_id, rank_position);

CREATE INDEX idx_conversations_branch_status
  ON conversations (academy_branch_id, conversation_status);

CREATE INDEX idx_messages_conversation_created_at
  ON messages (conversation_id, created_at);

CREATE INDEX idx_audit_events_entity
  ON audit_events (entity_type, entity_id, created_at);

CREATE INDEX idx_audit_events_actor
  ON audit_events (actor_user_id, created_at);

CREATE INDEX idx_payment_orders_org_status
  ON payment_orders (academy_organization_id, order_status);

CREATE INDEX idx_subscriptions_org_status
  ON subscriptions (academy_organization_id, subscription_status);
