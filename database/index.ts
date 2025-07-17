import * as schema from "./schema";

// Use USE_LOCAL_DB env variable to control DB selection ("true" = local, anything else = TiDB)
const isLocal = String(process.env.USE_LOCAL_DB).toLowerCase() === "true";

let db;
if (!isLocal) {
  // Use TiDB Serverless
  const { drizzle } = require("drizzle-orm/tidb-serverless");
  db = drizzle({
    connection: { url: process.env.TIDB_URL },
    schema,
  });
} else {
  // Use local MySQL
  const { drizzle } = require("drizzle-orm/mysql2");
  const mysql = require("mysql2/promise");
  const poolConnection = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "db_pemilihan_cat_dinding",
    port: Number(process.env.DB_PORT) || 3306,
  });
  db = drizzle(poolConnection, {
    schema,
    mode: "default",
  });
}

export { db };
export default db;
