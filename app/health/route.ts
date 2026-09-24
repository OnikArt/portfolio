import { database } from "@/lib/platform";
export async function GET(){try{await database().prepare('SELECT 1 AS ok').first();return Response.json({app:'ok',database:'ok'},{status:200,headers:{'cache-control':'no-store'}})}catch{return Response.json({app:'ok',database:'error'},{status:503,headers:{'cache-control':'no-store'}})}}
