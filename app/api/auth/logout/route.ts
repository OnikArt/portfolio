import { cookies } from "next/headers";import { adminCookie,secureCookieFor } from "@/lib/admin-auth";
export async function POST(request:Request){(await cookies()).set(adminCookie.name,'',{...adminCookie.options,secure:secureCookieFor(request),maxAge:0});return Response.json({ok:true})}
