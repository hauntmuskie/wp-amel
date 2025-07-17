import { drizzle } from "drizzle-orm/mysql2";
import { drizzle as drizzleTiDB } from "drizzle-orm/tidb-serverless";
import mysql from "mysql2/promise";

import * as schema from "./schema";

const isProd = process.env.IS_PROD === "true";

// Development database configuration (MySQL)
const devDb = () => {
  const poolConnection = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "db_pemilihan_cat_dinding",
    port: Number(process.env.DB_PORT) || 3306,
  });

  return drizzle(poolConnection, {
    schema,
    mode: "default",
  });
};

// Production database configuration (TiDB Serverless)
const prodDb = () => {
  return drizzleTiDB({
    connection: { url: process.env.TIDB_URL! },
    schema,
  });
};

export const db = isProd ? prodDb() : devDb();

export default db;
