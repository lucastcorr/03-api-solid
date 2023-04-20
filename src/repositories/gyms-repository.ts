import { Gym, Prisma } from '@prisma/client'

export interface SearchManyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  searchMany(query: string, page: number): Promise<Gym[]>
  searchManyNearby(params: SearchManyNearbyParams): Promise<Gym[]>
  findById(id: string): Promise<Gym | null>
}
