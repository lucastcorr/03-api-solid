import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })

  it('Should be able to register', async () => {
    const { user } = await sut.executeRegisterService({
      name: 'Elliot Alderson',
      email: 'ucancallmemrrobot2@example.com',
      password: '123456',
    })

    expect(user).toBeDefined()
  })

  it('Should hash user password upon registration', async () => {
    const { user } = await sut.executeRegisterService({
      name: 'Elliot Alderson',
      email: 'ucancallmemrrobot2@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Should not be able to register with same email twice', async () => {
    const email = 'ucancallmemrrobot2@example.com'

    await sut.executeRegisterService({
      name: 'Elliot Alderson',
      email: 'ucancallmemrrobot2@example.com',
      password: '123456',
    })

    await expect(() =>
      sut.executeRegisterService({
        name: 'Elliot Alderson',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
