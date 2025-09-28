import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env/index.js";
import { appRoutes } from "./http/routes.js";

export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }
  if(env.NODE_ENV !== 'prod') {
    console.error(error)
  }else {
    //TODO: Here we should log the error to an external tool like DataDog/NewRelic/Sentry
  }
  return reply.status(500).send({ message: "Internal server error." });
})