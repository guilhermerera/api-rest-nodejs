import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    ENVIRONMENT: z.enum(["development", "test", "production"]).default("production"),
	DATABASE_URL: z.string(),
	PORT: z.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("⛔️ Invalid environment variables:", _env.error.format());
    throw new Error("Invalid environment variables. Please see the logs above for more details.");
}

export const env = _env.data;

