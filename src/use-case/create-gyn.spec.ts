import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyns-repository.js";
import { CreateGynUseCase } from "./create-gyn.js";
import { beforeEach, describe, expect, it } from "vitest";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGynUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGynUseCase(gymsRepository);
  });
  
  it("should be able to create a gym", async () => {

    const { gym } = await sut.execute({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: -22.8506215,
      longitude: -43.087459,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
