import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Service', () => {
  it('Should be able to authenticate access', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

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
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

    await usersRepository.create({
      name: 'Fulaninho',
      email: 'fulaninho123@gmail.com',
      password_hash: await hash('123456', 6),
    })

    expect(() =>
      sut.executeAuthenticateService({
        email: 'fulaninho@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Should not be able to authenticate access with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

    await usersRepository.create({
      name: 'Fulaninho',
      email: 'fulaninho123@gmail.com',
      password_hash: await hash('abcdef', 6),
    })

    expect(() =>
      sut.executeAuthenticateService({
        email: 'fulaninho@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
