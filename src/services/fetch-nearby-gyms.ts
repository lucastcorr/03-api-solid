import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface FetchNearbyGymServiceRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymServiceResponse {
  gyms: Gym[]
}

export class FetchNearbyGymService {
  constructor(private gymsRepository: GymsRepository) {}

  async executeFetchNearbyGymService({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymServiceRequest): Promise<FetchNearbyGymServiceResponse> {
    const gyms = await this.gymsRepository.searchManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      gyms,
    }
  }
}
