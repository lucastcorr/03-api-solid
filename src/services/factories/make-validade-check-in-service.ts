import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidadeCheckInService } from '../validate-check-in'

export function makeValidateCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const validateCheckInService = new ValidadeCheckInService(checkInsRepository)

  return validateCheckInService
}
