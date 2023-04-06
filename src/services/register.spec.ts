import { describe, expect, it } from 'vitest'
import { RegisterService } from './register'
// import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Service', () => {
  it('Should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const { user } = await registerService.executeRegisterService({
      name: 'Elliot Alderson',
      email: 'ucancallmemrrobot2@example.com',
      password: '123456',
    })

    expect(user).toBeDefined()
  })

  it('Should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const { user } = await registerService.executeRegisterService({
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
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const email = 'ucancallmemrrobot2@example.com'

    await registerService.executeRegisterService({
      name: 'Elliot Alderson',
      email: 'ucancallmemrrobot2@example.com',
      password: '123456',
    })

    expect(() =>
      registerService.executeRegisterService({
        name: 'Elliot Alderson',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
