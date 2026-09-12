import { cookies } from "next/headers";import { redirect } from "next/navigation";import { env } from "cloudflare:workers";
const COOKIE='onikart_admin';
type Runtime={ADMIN_EMAIL?:string;ADMIN_PASSWORD_HASH?:string;ADMIN_SESSION_SECRET?:string};
const runtime=()=>{const worker=env as unknown as Runtime;return {ADMIN_EMAIL:worker.ADMIN_EMAIL??process.env.ADMIN_EMAIL,ADMIN_PASSWORD_HASH:worker.ADMIN_PASSWORD_HASH??process.env.ADMIN_PASSWORD_HASH,ADMIN_SESSION_SECRET:worker.ADMIN_SESSION_SECRET??process.env.ADMIN_SESSION_SECRET}}
const bytes=(s:string)=>new TextEncoder().encode(s);
async function sign(payload:string){const key=await crypto.subtle.importKey('raw',bytes(runtime().ADMIN_SESSION_SECRET||''),{name:'HMAC',hash:'SHA-256'},false,['sign']);return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,bytes(payload)))).map(x=>x.toString(16).padStart(2,'0')).join('')}
export async function makeSession(email:string){const payload=btoa(JSON.stringify({email,exp:Date.now()+1000*60*60*12}));return `${payload}.${await sign(payload)}`}
export async function readAdmin(){const token=(await cookies()).get(COOKIE)?.value;if(!token)return null;const [payload,mac]=token.split('.');if(!payload||!mac||await sign(payload)!==mac)return null;try{const data=JSON.parse(atob(payload)) as {email:string;exp:number};return data.exp>Date.now()&&data.email===runtime().ADMIN_EMAIL?data:null}catch{return null}}
export async function requireAdmin(returnTo='/admin'){const admin=await readAdmin();if(!admin)redirect(`/admin/login?returnTo=${encodeURIComponent(returnTo)}`);return admin}
export const adminConfig=()=>({email:runtime().ADMIN_EMAIL,hash:runtime().ADMIN_PASSWORD_HASH,ready:Boolean(runtime().ADMIN_EMAIL&&runtime().ADMIN_PASSWORD_HASH&&runtime().ADMIN_SESSION_SECRET)});
export const adminCookie={name:COOKIE,options:{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict' as const,path:'/',maxAge:60*60*12}};
