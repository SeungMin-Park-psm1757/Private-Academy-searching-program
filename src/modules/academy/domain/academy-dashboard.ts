export interface BranchOverview {
  branchId: string;
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

export interface AcademyDashboard {
  totalBranches: number;
  publishedBranches: number;
  pendingReviewBranches: number;
  totalActiveLeads: number;
  totalWaitlist: number;
  branches: BranchOverview[];
}
