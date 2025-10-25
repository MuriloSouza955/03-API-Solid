import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms.js";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch nearby gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -22.7852417,
      longitude: -43.3903683,
    });

    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -22.8506215,
      longitude: -43.087459,
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.8506215,
      userLongitude: -43.087459,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" }),
    ]);
  });
});
