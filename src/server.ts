import fastify from "fastify";

const app = fastify();
const PORT = 3000;

app.get("/", async () => {
	return { hello: "world" };
});

app
	.listen({
		port: PORT
	})
	.then(() => {
		console.log(`Server Runnin on port ${PORT}`);
	});
