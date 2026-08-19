import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();


const envSchema = z.object({
    PORT: z.coerce.number(),
    MONGODB_URI: z.string().min(1),
    ACCESS_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),

});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(parsed.error.format());
    process.exit(1);
}

export default parsed.data;