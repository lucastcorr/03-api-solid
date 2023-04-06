import { describe, expect, it } from 'vitest'
import { RegisterService } from './register'
// import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { compare } from 'bcryptjs'

describe('Register Service', () => {
  it('Should hash user password upon registration', async () => {
    // const prismaUsersRepository = new PrismaUsersRepository()
    // const registerService = new RegisterService({ fakeRegisterServiceForTests })

    const fakeRegisterServiceForTests = new RegisterService({
      async findByEmail(email) {
        return null
      },

      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
    })

    const { user } = await fakeRegisterServiceForTests.executeRegisterService({
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
})
