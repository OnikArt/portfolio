export function clientIp(request:Request):string {
  const forwarded=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const candidate=request.headers.get("cf-connecting-ip")||forwarded||request.headers.get("x-real-ip")||"unknown";
  return /^[a-f0-9:.]{3,45}$/i.test(candidate)?candidate:"unknown";
}
