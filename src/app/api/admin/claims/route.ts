import { NextResponse } from "next/server";
import { GetAdminConsoleUseCase } from "@/modules/audit/application/use-cases/get-admin-console.use-case";
import { InMemoryAdminConsoleRepository } from "@/modules/audit/infrastructure/repositories/in-memory-admin-console.repository";

const getAdminConsoleUseCase = new GetAdminConsoleUseCase(
  new InMemoryAdminConsoleRepository(),
);

export async function GET() {
  const overview = await getAdminConsoleUseCase.execute();
  return NextResponse.json({
    reviewQueue: overview.reviewQueue,
    reviewQueueCount: overview.reviewQueueCount,
    highRiskCount: overview.highRiskCount,
  });
}
