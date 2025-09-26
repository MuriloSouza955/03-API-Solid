import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'
import { hash } from 'bcryptjs'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { ca } from 'zod/locales'
import { registerUseCase } from '@/use-case/register.js'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })
  const {name, email, password} = registerBodySchema.parse(request.body)

  try {
    await registerUseCase({ name, email, password })

  } catch (err) {
    return reply.status(400).send()
  }
  
  return reply.status(201).send();
};