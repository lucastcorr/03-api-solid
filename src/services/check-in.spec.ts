import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'
import { randomUUID } from 'node:crypto'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInService

describe('Check-in Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInService(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to check in', async () => {
    const { checkIn } = await sut.executeCheckInService({
      userId: randomUUID(),
      gymId: randomUUID(),
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in twice in a day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.executeCheckInService({
      userId: 'user-01',
      gymId: randomUUID(),
    })

    await expect(() =>
      sut.executeCheckInService({
        userId: 'user-01',
        gymId: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('Should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.executeCheckInService({
      userId: 'user-01',
      gymId: randomUUID(),
    })

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.executeCheckInService({
      userId: 'user-01',
      gymId: randomUUID(),
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
