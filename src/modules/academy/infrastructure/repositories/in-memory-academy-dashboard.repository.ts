import { AcademyDashboardRepositoryPort } from "@/modules/academy/application/ports/academy-dashboard-repository.port";
import { AcademyDashboard } from "@/modules/academy/domain/academy-dashboard";
import { mockBranchRecords } from "@/shared/lib/mock-platform-data";

export class InMemoryAcademyDashboardRepository
  implements AcademyDashboardRepositoryPort
{
  async getDashboard(): Promise<AcademyDashboard> {
    return {
      totalBranches: mockBranchRecords.length,
      publishedBranches: mockBranchRecords.filter(
        (branch) => branch.reviewStatus === "published",
      ).length,
      pendingReviewBranches: mockBranchRecords.filter(
        (branch) => branch.reviewStatus === "pending_review",
      ).length,
      totalActiveLeads: mockBranchRecords.reduce(
        (sum, branch) => sum + branch.activeLeadsCount,
        0,
      ),
      totalWaitlist: mockBranchRecords.reduce(
        (sum, branch) => sum + branch.waitlistCount,
        0,
      ),
      branches: mockBranchRecords.map((branch) => ({
        branchId: branch.branchId,
        academyName: branch.academyName,
        branchName: branch.branchName,
        reviewStatus: branch.reviewStatus,
        supportsShuttle: branch.supportsShuttle,
        shuttleNotes: branch.shuttleNotes,
        programsCount: branch.programsCount,
        classesCount: branch.classesCount,
        activeLeadsCount: branch.activeLeadsCount,
        waitlistCount: branch.waitlistCount,
        updatedAt: branch.updatedAt,
        nextAction: branch.nextAction,
      })),
    };
  }
}
