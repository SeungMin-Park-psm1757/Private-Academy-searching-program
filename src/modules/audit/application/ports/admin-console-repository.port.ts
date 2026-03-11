import { AdminConsoleOverview } from "../../domain/admin-console";

export interface AdminConsoleRepositoryPort {
  getOverview(): Promise<AdminConsoleOverview>;
}
