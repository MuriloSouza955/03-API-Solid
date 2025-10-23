import { z } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";
import { makeSearchGymsUseCase } from "@/use-case/factories/make-search-gyms-use-case.js";

export async function search (request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });
  const { q, page } =
    searchGymsQuerySchema.parse(request.query);

  const searchGymUseCase = makeSearchGymsUseCase();

  const { gyms } =  await searchGymUseCase.execute({
    query: q,
    page,
  });
  return reply.status(200).send({ gyms });
}
