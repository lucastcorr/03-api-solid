import { SearchGymService } from '../search-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeSearchGymsService() {
  const gymsRepository = new PrismaGymsRepository()
  const searchGymService = new SearchGymService(gymsRepository)

  return searchGymService
}
