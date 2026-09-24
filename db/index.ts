import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { postgresPool } from "@/lib/postgres";

export const db=drizzle(postgresPool(),{schema});
