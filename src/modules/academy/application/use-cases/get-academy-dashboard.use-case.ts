import { AcademyDashboard } from "../../domain/academy-dashboard";
import { AcademyDashboardRepositoryPort } from "../ports/academy-dashboard-repository.port";

export class GetAcademyDashboardUseCase {
  constructor(
    private readonly academyDashboardRepository: AcademyDashboardRepositoryPort,
  ) {}

  async execute(): Promise<AcademyDashboard> {
    return this.academyDashboardRepository.getDashboard();
  }
}
