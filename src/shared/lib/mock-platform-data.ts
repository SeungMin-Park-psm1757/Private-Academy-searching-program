export interface MockBranchRecord {
  branchId: string;
  organizationId: string;
  academyName: string;
  branchName: string;
  reviewStatus: "draft" | "pending_review" | "published" | "suspended";
  supportsShuttle: boolean;
  shuttleNotes: string | null;
  programsCount: number;
  classesCount: number;
  activeLeadsCount: number;
  waitlistCount: number;
  updatedAt: string;
  nextAction: string;
}

export interface MockReviewItem {
  id: string;
  entityType: "academy_branch" | "program" | "class_group";
  academyName: string;
  branchName: string;
  requestedBy: string;
  requestedAt: string;
  riskLevel: "medium" | "high";
  fields: string[];
  summary: string;
}

export interface MockAuditItem {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityLabel: string;
  createdAt: string;
  summary: string;
}

export const mockBranchRecords: MockBranchRecord[] = [
  {
    branchId: "branch-01",
    organizationId: "org-01",
    academyName: "대치 개념랩",
    branchName: "대치 본원",
    reviewStatus: "published",
    supportsShuttle: true,
    shuttleNotes: "대치역, 한티역 순환 셔틀 운영",
    programsCount: 4,
    classesCount: 8,
    activeLeadsCount: 5,
    waitlistCount: 2,
    updatedAt: "2026-03-10T16:30:00+09:00",
    nextAction: "봄학기 시간표 확정본 반영",
  },
  {
    branchId: "branch-01b",
    organizationId: "org-01",
    academyName: "대치 개념랩",
    branchName: "도곡 스튜디오",
    reviewStatus: "pending_review",
    supportsShuttle: true,
    shuttleNotes: "도곡, 개포 라인 한정 셔틀",
    programsCount: 2,
    classesCount: 4,
    activeLeadsCount: 2,
    waitlistCount: 1,
    updatedAt: "2026-03-11T09:20:00+09:00",
    nextAction: "차량지원 범위 문구 검수 필요",
  },
  {
    branchId: "branch-02",
    organizationId: "org-02",
    academyName: "역삼 스몰그룹 수학관",
    branchName: "역삼 센터",
    reviewStatus: "published",
    supportsShuttle: false,
    shuttleNotes: null,
    programsCount: 3,
    classesCount: 5,
    activeLeadsCount: 7,
    waitlistCount: 4,
    updatedAt: "2026-03-09T12:15:00+09:00",
    nextAction: "대기열 안내 메시지 자동화 준비",
  },
];

export const mockReviewQueue: MockReviewItem[] = [
  {
    id: "review-1",
    entityType: "academy_branch",
    academyName: "대치 개념랩",
    branchName: "도곡 스튜디오",
    requestedBy: "academy_owner",
    requestedAt: "2026-03-11T09:24:00+09:00",
    riskLevel: "high",
    fields: ["supports_shuttle", "shuttle_notes", "review_status"],
    summary: "셔틀 운영 범위 확장과 공개 문구 변경 요청",
  },
  {
    id: "review-2",
    entityType: "program",
    academyName: "선릉 수학포레",
    branchName: "선릉 본관",
    requestedBy: "academy_editor",
    requestedAt: "2026-03-10T18:05:00+09:00",
    riskLevel: "medium",
    fields: ["monthly_fee_krw", "teaching_style_tags"],
    summary: "봄학기 가격과 개념 강화 태그 조정 요청",
  },
];

export const mockAuditFeed: MockAuditItem[] = [
  {
    id: "audit-1",
    actorName: "platform_reviewer",
    actorRole: "platform_reviewer",
    action: "APPROVED_BRANCH_UPDATE",
    entityLabel: "대치 개념랩 / 대치 본원",
    createdAt: "2026-03-11T10:11:00+09:00",
    summary: "봄학기 중2 수학 시간표 변경 승인",
  },
  {
    id: "audit-2",
    actorName: "academy_owner",
    actorRole: "academy_owner",
    action: "REQUESTED_REVIEW",
    entityLabel: "대치 개념랩 / 도곡 스튜디오",
    createdAt: "2026-03-11T09:24:00+09:00",
    summary: "셔틀 범위 및 노출 문구 검수 요청",
  },
  {
    id: "audit-3",
    actorName: "platform_admin",
    actorRole: "platform_admin",
    action: "CREATED_ROLLBACK_VERSION",
    entityLabel: "역삼 스몰그룹 수학관 / 역삼 센터",
    createdAt: "2026-03-10T16:02:00+09:00",
    summary: "가격 필드 과거 버전을 기반으로 신규 복원 버전 생성",
  },
];
