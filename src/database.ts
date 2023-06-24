import { knex as knexSetup, Knex } from "knex";
import { env } from "./env";

function getConnectionString() {
	switch (env.DATABASE_CLIENT) {
		case "sqlite":
			return {
				filename: env.DATABASE_URL
			};
		default:
			return env.DATABASE_URL;
	}
}

export const config: Knex.Config = {
	client: env.DATABASE_CLIENT,
	connection: getConnectionString(),
	useNullAsDefault: true,
	migrations: {
		extension: "ts",
		directory: "./db/migrations"
	}
};

export const knex = knexSetup(config);
