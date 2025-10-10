import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { CheckInUseCase } from "./check-in.js";
import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyns-repository.js";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error.js";
import { MaxNumberCheckInsError } from "./errors/max-number-check-in-error.js";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-In Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Gym 01",
      description: "",
      phone: "",
      latitude: -22.8506215,
      longitude: -43.087459,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(2022, 0, 10, 13, 0, 0));
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -22.8506215,
      userLongitude: -43.087459,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  //red, green, refactor

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 10, 13, 0, 0));
    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -22.8506215,
      userLongitude: -43.087459,
    });

    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: -22.8506215,
        userLongitude: -43.087459,
      })
    ).rejects.toBeInstanceOf(MaxNumberCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 10, 13, 0, 0));
    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -22.8506215,
      userLongitude: -43.087459,
    });

    vi.setSystemTime(new Date(2022, 0, 11, 13, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -22.8506215,
      userLongitude: -43.087459,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should be able to check in on distant gym", async () => {
    gymsRepository.itens.push({
      id: "gym-02",
      title: "Gym 02",
      description: "Gym 02",
      phone: "1234567890",
      latitude: new Decimal(-22.8258625),
      longitude: new Decimal(-43.0466465),
    });

    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-02",
        userLatitude: -22.8506216,
        userLongitude: -43.0874591,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
