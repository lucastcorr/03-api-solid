import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  it('Should be able to authenticate access', async () => {
    await usersRepository.create({
      name: 'Fulaninho',
      email: 'fulaninho@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.executeAuthenticateService({
      email: 'fulaninho@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Should not be able to authenticate access with wrong email', async () => {
    await usersRepository.create({
      name: 'Fulaninho',
      email: 'fulaninho123@gmail.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.executeAuthenticateService({
        email: 'fulaninho@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Should not be able to authenticate access with wrong password', async () => {
    await usersRepository.create({
      name: 'Fulaninho',
      email: 'fulaninho123@gmail.com',
      password_hash: await hash('abcdef', 6),
    })

    await expect(() =>
      sut.executeAuthenticateService({
        email: 'fulaninho@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
