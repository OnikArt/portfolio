import { readAdmin } from "@/lib/admin-auth";
import { clean, json } from "@/lib/platform";
import { runtimeEnv } from "@/lib/runtime-env";

export async function GET() {
  if (!await readAdmin()) return json({ error: "Требуется вход." }, 401);
  const runtime=runtimeEnv();
  if(!runtime.TELEGRAM_BOT_TOKEN||!runtime.TELEGRAM_ADMIN_CHAT_ID)return json({error:"Telegram не настроен."},503);
  try{const response=await fetch(`https://api.telegram.org/bot${runtime.TELEGRAM_BOT_TOKEN}/getMe`,{signal:AbortSignal.timeout(5000)});const body=await response.json() as {ok?:boolean;result?:{username?:string}};if(!response.ok||!body.ok)throw new Error('TELEGRAM_UNAVAILABLE');return json({ok:true,bot:clean(body.result?.username,100)});}catch{return json({error:"Проверка Telegram не прошла."},502)}
}

export async function POST() {
  if (!await readAdmin()) return json({ error: "Требуется вход." }, 401);
  const runtime=runtimeEnv();
  if(!runtime.TELEGRAM_BOT_TOKEN||!runtime.TELEGRAM_ADMIN_CHAT_ID)return json({error:"Telegram не настроен."},503);
  try{const response=await fetch(`https://api.telegram.org/bot${runtime.TELEGRAM_BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:runtime.TELEGRAM_ADMIN_CHAT_ID,text:`[ONIKART] Тест интеграции · ${new Date().toISOString()}`}),signal:AbortSignal.timeout(5000)});if(!response.ok)throw new Error('TELEGRAM_UNAVAILABLE');return json({ok:true});}catch{return json({error:"Тестовое сообщение не отправлено."},502)}
}
