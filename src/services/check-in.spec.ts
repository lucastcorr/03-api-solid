import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'
import { randomUUID } from 'node:crypto'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('Check-in Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-30.0148519),
      longitude: new Decimal(-51.1528434),
    })

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -30.0148519,
      longitude: -51.1528434,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to check in', async () => {
    const { checkIn } = await sut.executeCheckInService({
      // Here i use the randomUUI() method because we are not trying to compare data
      userId: randomUUID(),
      gymId: 'gym-01',
      userLatitude: -30.0148519,
      userLongitude: -51.1528434,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in twice in a day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.executeCheckInService({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -30.0148519,
      userLongitude: -51.1528434,
    })

    await expect(() =>
      sut.executeCheckInService({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -30.0148519,
        userLongitude: -51.1528434,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('Should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.executeCheckInService({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -30.0148519,
      userLongitude: -51.1528434,
    })

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.executeCheckInService({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -30.0148519,
      userLongitude: -51.1528434,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in on distant gym', async () => {
    // BodyTech Gym lat and log -30.0254421,-51.1953944
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-30.0254421),
      longitude: new Decimal(-51.1953944),
    })

    // User (my home) lat and long -30.0148519,-51.1528434
    await expect(() =>
      sut.executeCheckInService({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -30.0148519,
        userLongitude: -51.1528434,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
