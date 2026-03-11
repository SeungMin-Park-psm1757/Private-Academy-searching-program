import { AdminConsoleOverview } from "../../domain/admin-console";
import { AdminConsoleRepositoryPort } from "../ports/admin-console-repository.port";

export class GetAdminConsoleUseCase {
  constructor(
    private readonly adminConsoleRepository: AdminConsoleRepositoryPort,
  ) {}

  async execute(): Promise<AdminConsoleOverview> {
    return this.adminConsoleRepository.getOverview();
  }
}
