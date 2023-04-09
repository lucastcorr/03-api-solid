import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterService } from '../register'

export function makeRegisterService() {
  const userRepository = new PrismaUsersRepository()
  const registerService = new RegisterService(userRepository)

  return registerService
}
