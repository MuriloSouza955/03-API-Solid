import request from "supertest";
import { app } from "@/app.js";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma.js";

describe("Refresh Token (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
    await prisma.user.deleteMany(); // Limpa o banco antes dos testes

  });

  afterAll(async () => {
    await prisma.user.deleteMany(); // Limpa o banco depois dos testes
    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should be able to refresh a token", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "johndoe@example.com",
      password: "123456",
    });

    const cookies = authResponse.get("Set-Cookie");

    const response = await request(app.server).patch("/token/refresh").set("Cookie", cookies!).send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get("Set-Cookie")).toEqual(expect.arrayContaining([
      expect.stringContaining("refreshToken="),
    ]));
  });
});
