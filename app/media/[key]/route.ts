import { mediaStorage } from "@/lib/storage";

export async function GET(_request:Request,{params}:{params:Promise<{key:string}>}){
  const {key}=await params;
  const url=await mediaStorage.legacyUrl(key);
  return url?Response.redirect(url,308):new Response(null,{status:404});
}
