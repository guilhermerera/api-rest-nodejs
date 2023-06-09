import { FastifyReply, FastifyRequest } from "fastify";

export async function requestLogger(
	req: FastifyRequest,
	res: FastifyReply
) {
    console.log(`[${req.method}] ${req.url}`);
}