import { NextResponse } from "next/server";
import { GetAcademyDashboardUseCase } from "@/modules/academy/application/use-cases/get-academy-dashboard.use-case";
import { InMemoryAcademyDashboardRepository } from "@/modules/academy/infrastructure/repositories/in-memory-academy-dashboard.repository";

const getAcademyDashboardUseCase = new GetAcademyDashboardUseCase(
  new InMemoryAcademyDashboardRepository(),
);

export async function GET() {
  const dashboard = await getAcademyDashboardUseCase.execute();
  return NextResponse.json(dashboard);
}
