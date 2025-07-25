import { connect } from "@tidbcloud/serverless";
import { drizzle } from "drizzle-orm/tidb-serverless";

import * as schema from "./schema";

const client = connect({ url: process.env.TIDB_URL });

export const db = drizzle({
  client,
  schema,
});

// import { drizzle } from "drizzle-orm/mysql2";
// import mysql from "mysql2/promise";

// import * as schema from "./schema";

// const poolConnection = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_NAME || "db_pemilihan_cat_dinding",
//   port: Number(process.env.DB_PORT) || 3306,
// });

// export const db = drizzle(poolConnection, {
//   schema,
//   mode: "default",
// });
