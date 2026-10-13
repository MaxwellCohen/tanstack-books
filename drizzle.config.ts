import './src/lib/db/load-env';
import type { Config } from 'drizzle-kit';

export default {
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  dialect: 'postgresql',
  out: './src/lib/db/migrations',
  schema: './src/lib/db/schema.ts',
} satisfies Config;
