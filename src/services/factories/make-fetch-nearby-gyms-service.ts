import { FetchNearbyGymService } from '../fetch-nearby-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeFetchNearbyGymsService() {
  const gymsRepository = new PrismaGymsRepository()
  const fetchNearbyGymService = new FetchNearbyGymService(gymsRepository)

  return fetchNearbyGymService
}
