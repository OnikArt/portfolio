import { cookies } from "next/headers";import { adminCookie } from "@/lib/admin-auth";
export async function POST(){(await cookies()).set(adminCookie.name,'',{...adminCookie.options,maxAge:0});return Response.json({ok:true})}
