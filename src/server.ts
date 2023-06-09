import fastify from "fastify";
import { env } from "./env";
import { transactionRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie"
import { requestLogger } from "./middlewares/request-logger";
const app = fastify();

app.register(cookie)
app.addHook("preHandler", requestLogger);
app.register(transactionRoutes, { prefix: "transactions" });

app
	.listen({
		port: env.PORT
	})
	.then(() => {
		console.log(`Server Running on port ${env.PORT}`);
	});
