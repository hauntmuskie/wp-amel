import { defineConfig } from "drizzle-kit";

const dbCredentials = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  database: process.env.DB_NAME || "db_pemilihan_cat_dinding",
  port: Number(process.env.DB_PORT) || 3306,
  ...(process.env.DB_PASSWORD && { password: process.env.DB_PASSWORD }),
};

export default defineConfig({
  schema: "./database/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials,
});
