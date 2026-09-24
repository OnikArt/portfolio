import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const url=process.env.DATABASE_URL?.trim();
if(!url)throw new Error("DATABASE_URL is required for db:migrate");
if(!/^postgres(ql)?:\/\//i.test(url))throw new Error("DATABASE_URL must be a PostgreSQL URL");
const pool=new pg.Pool({connectionString:url,max:2});
try{await migrate(drizzle(pool),{migrationsFolder:"drizzle-pg"});console.log("PostgreSQL migrations applied.")}finally{await pool.end()}
