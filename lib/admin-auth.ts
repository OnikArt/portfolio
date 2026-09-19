import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "cloudflare:workers";
import { database } from "@/lib/platform";
const COOKIE='onikart_admin';
type Runtime={ADMIN_EMAIL?:string;ADMIN_PASSWORD_HASH?:string;ADMIN_SESSION_SECRET?:string};
export type AdminIdentity={email:string;displayName:string;role:string;permissions:string[];isOwner:boolean};
const runtime=()=>{const worker=env as unknown as Runtime;return {ADMIN_EMAIL:worker.ADMIN_EMAIL??process.env.ADMIN_EMAIL,ADMIN_PASSWORD_HASH:worker.ADMIN_PASSWORD_HASH??process.env.ADMIN_PASSWORD_HASH,ADMIN_SESSION_SECRET:worker.ADMIN_SESSION_SECRET??process.env.ADMIN_SESSION_SECRET}}
const bytes=(value:string)=>new TextEncoder().encode(value);
async function sign(payload:string){const key=await crypto.subtle.importKey('raw',bytes(runtime().ADMIN_SESSION_SECRET||''),{name:'HMAC',hash:'SHA-256'},false,['sign']);return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,bytes(payload)))).map(item=>item.toString(16).padStart(2,'0')).join('')}
export async function makeSession(email:string){const payload=btoa(JSON.stringify({email,exp:Date.now()+1000*60*60*12}));return `${payload}.${await sign(payload)}`}
export async function readAdmin():Promise<AdminIdentity|null>{const token=(await cookies()).get(COOKIE)?.value;if(!token)return null;const [payload,mac]=token.split('.');if(!payload||!mac||await sign(payload)!==mac)return null;try{const data=JSON.parse(atob(payload)) as {email:string;exp:number};if(data.exp<=Date.now())return null;const cfg=runtime();if(data.email.toLowerCase()===cfg.ADMIN_EMAIL?.toLowerCase())return {email:data.email,displayName:data.email,role:'OWNER',permissions:['*'],isOwner:true};const user=await database().prepare("SELECT u.email,u.name,r.name role,r.permissions FROM users u JOIN roles r ON r.id=u.role_id WHERE lower(u.email)=lower(?) AND u.active=1").bind(data.email).first<Record<string,unknown>>();if(!user)return null;return {email:String(user.email),displayName:String(user.name),role:String(user.role),permissions:JSON.parse(String(user.permissions||'[]')) as string[],isOwner:false}}catch{return null}}
export async function requireAdmin(returnTo='/admin'){const admin=await readAdmin();if(!admin)redirect(`/admin/login?returnTo=${encodeURIComponent(returnTo)}`);return admin}
export function can(identity:AdminIdentity,permission:string){return identity.isOwner||identity.permissions.includes('*')||identity.permissions.includes(permission)}
export async function requirePermission(permission:string){const identity=await readAdmin();return identity&&can(identity,permission)?identity:null}
export const adminConfig=()=>({email:runtime().ADMIN_EMAIL,hash:runtime().ADMIN_PASSWORD_HASH,ready:Boolean(runtime().ADMIN_EMAIL&&runtime().ADMIN_PASSWORD_HASH&&runtime().ADMIN_SESSION_SECRET)});
export const adminCookie={name:COOKIE,options:{httpOnly:true,sameSite:'strict' as const,path:'/',maxAge:60*60*12}};
export function secureCookieFor(request:Request){const forwarded=request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();return forwarded?forwarded==='https':new URL(request.url).protocol==='https:'}
