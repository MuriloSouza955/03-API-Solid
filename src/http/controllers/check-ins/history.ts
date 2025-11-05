import { z } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchUserCheckInHistoryUseCase } from "@/use-case/factories/make-fetch-user-check-ins-history-use-case.js";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });
  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const fetchUserCheckInHistoryUseCse = makeFetchUserCheckInHistoryUseCase();

  const { checkIns } = await fetchUserCheckInHistoryUseCse.execute({
    userId: request.user.sub,
    page,
  });
  return reply.status(200).send({ checkIns });
}
