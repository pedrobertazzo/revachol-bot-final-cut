import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

export const ENVIRONMENT = process.env.ENVIRONMENT || 'development';

const envSecretsPath = path.resolve(__dirname, `../../env/${ENVIRONMENT}-secrets.env`);
const envPath = path.resolve(__dirname, `../../env/${ENVIRONMENT}.env`);

console.log('Loading env vars from:', envSecretsPath, envPath);

dotenv.config({ path: envSecretsPath });
dotenv.config({ path: envPath });

const envSchema = z.object({
  API_KEY: z.string().min(1),
  API_BASE_URL: z.string().min(1),
  PORT: z.preprocess(Number, z.number()),
  API_MODEL: z.string().min(1),
});

export const envVars = envSchema.parse(process.env);
