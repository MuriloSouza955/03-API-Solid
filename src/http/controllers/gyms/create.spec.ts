import request from "supertest";
import { app } from "@/app.js";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.js";

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create gym", async () => {

    const { token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript Gym",
        description: "Some description.",
        phone: "11999999999",
        latitude: -22.8506215,
        longitude: -43.087459,
      });

    expect(response.statusCode).toEqual(201);
  });
});
