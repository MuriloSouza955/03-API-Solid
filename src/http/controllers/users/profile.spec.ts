import request from "supertest";
import { app } from "@/app.js";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.js";

describe("Profile Controller (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get user profile", async () => {

    const { token } = await createAndAuthenticateUser(app, true);
    

    const profileResponse = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(profileResponse.statusCode).toEqual(200);
    expect(profileResponse.body).toEqual({
      user: {
        created_at: expect.any(String),
        email: "johndoe@example.com",
        id: expect.any(String),
        name: "John Doe",
        role: "ADMIN",
      },
    });
  });
});
