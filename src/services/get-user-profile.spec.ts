import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileService } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileService

describe('Get user profile Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileService(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Fulaninho',
      email: 'fulaninho@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.executeGetUserProfileService({
      userId: createdUser.id,
    })

    expect(user.name).toEqual('Fulaninho')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await usersRepository.create({
      name: 'Fulaninho',
      email: 'fulaninho123@gmail.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.executeGetUserProfileService({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
