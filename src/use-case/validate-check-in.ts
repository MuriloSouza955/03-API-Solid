import type { CheckIn } from "@prisma/client";
import type { CheckInsRepository } from "@/repositories/check-ins-repository.js";
import type { GymsRepository } from "@/repositories/gyms-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";
import { getDistanceBetweenCoordinates } from "../utils/get-distance-between-coordinates.js";
import { MaxDistanceError } from "./errors/max-distance-error.js";
import { MaxNumberCheckInsError } from "./errors/max-number-check-in-error.js";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-n-validation-error.js";

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
  ) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCreckInCreation = dayjs().diff(checkIn.created_at, 'minutes');

    if (distanceInMinutesFromCreckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
