import type { Gym } from "@prisma/client";
import type { GymsRepository } from "@/repositories/gyms-repository.js";

interface CreateGynUseCaseRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGynUseCaseResponse {
  gym: Gym;
}

export class CreateGynUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGynUseCaseRequest): Promise<CreateGynUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return {
      gym,
    };
  }
}
