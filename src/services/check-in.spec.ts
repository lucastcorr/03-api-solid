import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'
import { randomUUID } from 'node:crypto'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInService

describe('Check-in Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInService(checkInsRepository)
  })

  it('Should be able to check in', async () => {
    const { checkIn } = await sut.executeCheckInService({
      userId: randomUUID(),
      gymId: randomUUID(),
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
