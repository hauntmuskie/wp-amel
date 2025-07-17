// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   schema: "./database/schema.ts",
//   out: "./drizzle",
//   dialect: "mysql",
//   dbCredentials: {
//     url: process.env.TIDB_URL!,
//   },
// });

import { defineConfig } from "drizzle-kit";

let config;
if (process.env.NODE_ENV === "production") {
  // TiDB in production
  if (!process.env.TIDB_URL) {
    throw new Error("TIDB_URL environment variable must be set in production");
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
  // MySQL in development
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
