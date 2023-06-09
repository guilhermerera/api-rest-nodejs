import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";


export async function transactionRoutes(app: FastifyInstance) {
	// Create a transaction
	app.post("/", async (req, res) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(["credit", "debit"])
		});

		const { title, amount, type } = createTransactionBodySchema.parse(req.body);

		let sessionId = req.cookies.sessionId;

		if (!sessionId) {
			sessionId = randomUUID();
			res.setCookie("sessionId", sessionId, {
				path: "/",
				maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
			});
		}

		await knex("transactions").insert({
			id: randomUUID(),
			title,
			amount: type === "debit" ? amount * -1 : amount,
			session_id: sessionId
		});

		return res
			.status(201)
			.send({ message: `Transaction created. ${amount} for ${title}` });
	});

	// Get all transactions
	app.get("/", { preHandler: [checkSessionIdExists] }, async (req, res) => {
		const { sessionId } = req.cookies;
		const transactions = await knex("transactions")
			.select()
			.where("session_id", sessionId);

		return res.status(200).send({ transactions });
	});

	// Get transaction by id
	app.get("/:id", { preHandler: [checkSessionIdExists] }, async (req, res) => {
		const { sessionId } = req.cookies;
		const getTransactionByIdParamsSchema = z.object({
			id: z.string().uuid()
		});

		const { id } = getTransactionByIdParamsSchema.parse(req.params);
		const transaction = await knex("transactions")
			.where({
				session_id: sessionId,
				id
			})
			.first();
		
		if (!transaction) {
			return res.status(404).send({ message: "Transaction not found." });
		}

		return res.status(200).send({ transaction });
	});

	//Get Sumarized transactions by User
	app.get(
		"/summary",
		{ preHandler: [checkSessionIdExists] },
		async (req, res) => {
			const { sessionId } = req.cookies;
			const summary = await knex("transactions")
				.where("session_id", sessionId)
				.sum("amount", { as: "amount" })
				.first();

			return res.status(200).send({ summary });
		}
	);
}
