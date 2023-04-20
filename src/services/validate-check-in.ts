import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface ValidadeCheckInServiceRequest {
  checkInId: string
}

interface ValidadeCheckInServiceResponse {
  checkIn: CheckIn
}

export class ValidadeCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async executeValidadeCheckInService({
    checkInId,
  }: ValidadeCheckInServiceRequest): Promise<ValidadeCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
