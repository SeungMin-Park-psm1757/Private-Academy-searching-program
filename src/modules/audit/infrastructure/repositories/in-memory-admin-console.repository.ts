import { AdminConsoleRepositoryPort } from "@/modules/audit/application/ports/admin-console-repository.port";
import { AdminConsoleOverview } from "@/modules/audit/domain/admin-console";
import { mockAuditFeed, mockReviewQueue } from "@/shared/lib/mock-platform-data";

export class InMemoryAdminConsoleRepository
  implements AdminConsoleRepositoryPort
{
  async getOverview(): Promise<AdminConsoleOverview> {
    return {
      reviewQueueCount: mockReviewQueue.length,
      highRiskCount: mockReviewQueue.filter((item) => item.riskLevel === "high").length,
      rollbackReadyCount: mockAuditFeed.filter((item) =>
        item.action.includes("ROLLBACK"),
      ).length,
      reviewQueue: mockReviewQueue,
      auditFeed: mockAuditFeed,
    };
  }
}
