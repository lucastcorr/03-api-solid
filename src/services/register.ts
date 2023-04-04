import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

/**
 * SOLID
 * D: Dependency Inversion Principle
 */

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async executeRegisterService({
    name,
    email,
    password,
  }: RegisterServiceRequest) {
    const password_hash = await hash(password, 6)

    const emailAlreadyExists = await this.usersRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new Error('Email already exists.')
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
