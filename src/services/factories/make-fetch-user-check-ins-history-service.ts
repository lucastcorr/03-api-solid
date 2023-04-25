import { FetchUserCheckInsHistoryService } from '../fetch-user-check-ins-history'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeFetchUserCheckInsHistoryService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const fetchUserCheckInsHistoryService = new FetchUserCheckInsHistoryService(
    checkInsRepository,
  )

  return fetchUserCheckInsHistoryService
}
