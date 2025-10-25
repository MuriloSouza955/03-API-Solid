import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository.js";
import { GetUserMetricsUseCase } from "../get-user-metrics.js";

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository);

  return getUserMetricsUseCase;
}
