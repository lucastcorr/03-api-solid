import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileService } from '../get-user-profile'

export function makeGetUserProfileService() {
  const userRepository = new PrismaUsersRepository()
  const getUserProfileService = new GetUserProfileService(userRepository)

  return getUserProfileService
}
