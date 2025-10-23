import request from "supertest";
import { app } from "@/app.js";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma.js";

describe("Authenticate Controller (E2E)", () => {
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

  it("should be able to authenticate", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const response = await request(app.server).post("/sessions").send({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
