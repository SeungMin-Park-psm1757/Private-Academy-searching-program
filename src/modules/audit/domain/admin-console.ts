export interface ReviewQueueItem {
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

export interface AuditFeedItem {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityLabel: string;
  createdAt: string;
  summary: string;
}

export interface AdminConsoleOverview {
  reviewQueueCount: number;
  highRiskCount: number;
  rollbackReadyCount: number;
  reviewQueue: ReviewQueueItem[];
  auditFeed: AuditFeedItem[];
}
