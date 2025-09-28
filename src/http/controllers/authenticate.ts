import { z } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";
import { InvalidCredentialsError } from "@/use-case/errors/invalid-credentials-error.js";
import { makeAuthenticateUseCase } from "@/use-case/factories/make-authenticate-use-case.js";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    await authenticateUseCase.execute({ email, password });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
  return reply.status(200).send();
}
