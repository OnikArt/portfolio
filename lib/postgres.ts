import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { requiredDatabaseUrl } from "@/lib/runtime-env";
type Row=Record<string,unknown>;type Executor=Pick<Pool|PoolClient,"query">;
const globalPool=globalThis as typeof globalThis&{__onikartPool?:Pool};
export function postgresPool(){
  if(!globalPool.__onikartPool){
    const pool=new Pool({connectionString:requiredDatabaseUrl(),max:2,idleTimeoutMillis:10_000,connectionTimeoutMillis:5_000});
    pool.on('error',()=>console.error('PostgreSQL idle connection error'));
    globalPool.__onikartPool=pool;
  }
  return globalPool.__onikartPool;
}
function postgresSql(source:string){let position=0;const ratings=source.replace("INSERT OR REPLACE INTO ratings (id,conversation_id,score,comment) SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM conversations WHERE id=? AND visitor_id=?)","INSERT INTO ratings (id,conversation_id,score,comment) SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM conversations WHERE id=? AND visitor_id=?) ON CONFLICT(conversation_id) DO UPDATE SET id=EXCLUDED.id,score=EXCLUDED.score,comment=EXCLUDED.comment,created_at=CURRENT_TIMESTAMP");const booleans=ratings.replace(/\b(is_visible|visible|published|featured|highlighted|active|is_system)\s*=\s*1\b/gi,'$1=true').replace(/\b(is_visible|visible|published|featured|highlighted|active|is_system)\s*=\s*0\b/gi,'$1=false');return booleans.replace(/\?/g,()=>`$${++position}`)}
function compatibleValue(value:unknown):unknown{if(value instanceof Date)return value.toISOString();if(Array.isArray(value)||(value&&typeof value==='object'))return JSON.stringify(value);return value}
function compatibleRow<T extends QueryResultRow>(row:T):T{return Object.fromEntries(Object.entries(row).map(([key,value])=>[key,compatibleValue(value)])) as T}
export class PreparedQuery{private values:unknown[]=[];constructor(readonly source:string,private readonly executor:Executor=postgresPool()){}bind(...values:unknown[]){this.values=values;return this}async all<T extends Row>(){const result=await this.executor.query(postgresSql(this.source),this.values);return{results:result.rows.map(row=>compatibleRow(row as QueryResultRow)) as T[]}}async first<T extends Row>(){const result=await this.executor.query(postgresSql(this.source),this.values);return result.rows[0]?compatibleRow(result.rows[0] as QueryResultRow) as T:null}async run(){const result=await this.executor.query(postgresSql(this.source),this.values);return{success:true,meta:{changes:result.rowCount??0}}}async execute(executor:Executor){return executor.query(postgresSql(this.source),this.values)}}
export const postgresDatabase={prepare(source:string){return new PreparedQuery(source)},async batch(statements:PreparedQuery[]){const client=await postgresPool().connect();try{await client.query('BEGIN');const results=[];for(const statement of statements)results.push(await statement.execute(client));await client.query('COMMIT');return results}catch(error){try{await client.query('ROLLBACK')}catch{console.error('PostgreSQL rollback failed')}throw error}finally{client.release()}}};
