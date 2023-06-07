import fastify from "fastify";
import { knex } from "./database";
import crypto from "node:crypto";
import { env } from "./env";

const app = fastify();


app.get("/transactions", async () => {
	const transactions = await knex("transactions").select("*").where("amount", 1000)
	return transactions;
});

app
	.listen({
		port: env.PORT
	})
	.then(() => {
		console.log(`Server Running on port ${env.PORT}`);
	});
