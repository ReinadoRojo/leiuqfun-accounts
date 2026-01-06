import { createClient } from '@libsql/client';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({ url: process.env.DATABASE_URL! });
const db = drizzle({ client });

export { db };