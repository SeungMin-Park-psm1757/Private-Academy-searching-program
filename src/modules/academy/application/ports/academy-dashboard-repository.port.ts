import { AcademyDashboard } from "../../domain/academy-dashboard";

export interface AcademyDashboardRepositoryPort {
  getDashboard(): Promise<AcademyDashboard>;
}
