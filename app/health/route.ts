import { database } from "@/lib/platform";
export async function GET(){let databaseStatus='unavailable';try{await database().prepare('SELECT 1').first();databaseStatus='ok'}catch{}return Response.json({status:'ok',timestamp:new Date().toISOString(),database:databaseStatus},{status:200,headers:{'cache-control':'no-store'}})}
