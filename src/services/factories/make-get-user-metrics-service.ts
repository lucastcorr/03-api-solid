import { GetUserMetricsService } from '../get-user-metrics'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeGetUserMetricsService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const getUserMetricsService = new GetUserMetricsService(checkInsRepository)

  return getUserMetricsService
}
