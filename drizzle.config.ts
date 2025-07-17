import { defineConfig } from "drizzle-kit";

const isLocal =
  process.env.USE_LOCAL_DB === "1" || process.env.USE_LOCAL_DB === "true";

let config;
if (!isLocal) {
  if (!process.env.TIDB_URL) {
    throw new Error(
      "TIDB_URL environment variable must be set when using TiDB Serverless"
    );
  }
  config = defineConfig({
    schema: "./database/schema.ts",
    out: "./drizzle",
    dialect: "mysql",
    dbCredentials: {
      url: process.env.TIDB_URL,
    },
  });
} else {
  config = defineConfig({
    schema: "./database/schema.ts",
    out: "./drizzle",
    dialect: "mysql",
    dbCredentials: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      database: process.env.DB_NAME || "db_pemilihan_cat_dinding",
      port: Number(process.env.DB_PORT) || 3306,
      ...(process.env.DB_PASSWORD && { password: process.env.DB_PASSWORD }),
    },
  });
}

export default config;
