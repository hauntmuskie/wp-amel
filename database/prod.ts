import { drizzle } from "drizzle-orm/tidb-serverless";

import * as schema from "./schema";

export const db = drizzle({
  connection: { url: process.env.TIDB_URL! },
  schema,
});

export default db;
