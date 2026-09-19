import { env } from "cloudflare:workers";
import { readAdmin } from "@/lib/admin-auth";
import { clean, json } from "@/lib/platform";

export async function GET() {
  if (!await readAdmin()) return json({ error: "Требуется вход." }, 401);
  const runtime=env as unknown as {TELEGRAM_BOT_TOKEN?:string;TELEGRAM_ADMIN_CHAT_ID?:string};
  if(!runtime.TELEGRAM_BOT_TOKEN||!runtime.TELEGRAM_ADMIN_CHAT_ID)return json({error:"Telegram не настроен."},503);
  try{const response=await fetch(`https://api.telegram.org/bot${runtime.TELEGRAM_BOT_TOKEN}/getMe`);const body=await response.json() as {ok?:boolean;result?:{username?:string}};if(!response.ok||!body.ok)throw new Error(`HTTP_${response.status}`);return json({ok:true,bot:clean(body.result?.username,100)});}catch(error){return json({error:`Проверка Telegram не прошла: ${clean(error instanceof Error?error.message:'UNKNOWN',120)}`},502)}
}

export async function POST() {
  if (!await readAdmin()) return json({ error: "Требуется вход." }, 401);
  const runtime=env as unknown as {TELEGRAM_BOT_TOKEN?:string;TELEGRAM_ADMIN_CHAT_ID?:string};
  if(!runtime.TELEGRAM_BOT_TOKEN||!runtime.TELEGRAM_ADMIN_CHAT_ID)return json({error:"Telegram не настроен."},503);
  try{const response=await fetch(`https://api.telegram.org/bot${runtime.TELEGRAM_BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:runtime.TELEGRAM_ADMIN_CHAT_ID,text:`[ONIKART] Тест интеграции · ${new Date().toISOString()}`})});if(!response.ok)throw new Error(`HTTP_${response.status}`);return json({ok:true});}catch(error){return json({error:`Тестовое сообщение не отправлено: ${clean(error instanceof Error?error.message:'UNKNOWN',120)}`},502)}
}
