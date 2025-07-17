import * as schema from "./schema";

const isLocal = String(process.env.USE_LOCAL_DB).toLowerCase() === "true";

let db;
if (!isLocal) {
  const { drizzle } = require("drizzle-orm/tidb-serverless");
  db = drizzle({
    connection: { url: process.env.TIDB_URL },
    schema,
  });
} else {
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
