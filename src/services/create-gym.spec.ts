import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymService } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymService

describe('Register Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it('Should be able to create a gym', async () => {
    const { gym } = await sut.executeCreateGymService({
      title: 'JavaScrypt Gym',
      description: null,
      phone: null,
      latitude: '-30.0148519',
      longitude: '-51.1528434',
    })

    expect(gym).toBeDefined()
  })
})
