import { postgresDatabase } from "@/lib/postgres";
import { runtimeEnv } from "@/lib/runtime-env";

type Row = Record<string, unknown>;
export function database() { return postgresDatabase; }
export const id = () => crypto.randomUUID();
export const clean = (value: unknown, max = 2000) => String(value ?? "").replace(/[<>]/g, "").trim().slice(0, max);
export function json(data: unknown, status = 200) { return Response.json(data, { status, headers: { "Cache-Control": "no-store" } }); }
export async function all<T extends Row>(sql: string, ...binds: unknown[]) { return (await database().prepare(sql).bind(...binds).all<T>()).results; }
export async function one<T extends Row>(sql: string, ...binds: unknown[]) { return database().prepare(sql).bind(...binds).first<T>(); }
export async function adminIdentity(request: Request) { const user = request.headers.get("oai-authenticated-user-id"); const email = request.headers.get("oai-authenticated-user-email"); return user && email ? { user, email } : null; }

const categories: Record<string, string> = { LEAD_CREATED: "LEADS", CONVERSATION_CREATED: "CHAT", VISITOR_MESSAGE: "CHAT", ADMIN_REPLY: "CHAT", CONVERSATION_CLOSED: "CHAT", RATING_SUBMITTED: "CHAT" };
const eventLabels:Record<string,string>={LEAD_CREATED:"🔥 Новая заявка — OnikArt",VISITOR_MESSAGE:"💬 Новый диалог — OnikArt",RATING_SUBMITTED:"⭐ Новая оценка диалога",WORKS_CREATED:"🛠 Создан проект",WORKS_UPDATED:"🛠 Обновлён проект",WORKS_DELETED:"🗑 Удалён проект",TARIFFS_CREATED:"✏️ Создан формат работы",TARIFFS_UPDATED:"✏️ Обновлён формат работы",TARIFFS_DELETED:"🗑 Удалён формат работы",SERVICES_CREATED:"🛠 Создана услуга",SERVICES_UPDATED:"🛠 Обновлена услуга",SERVICES_DELETED:"🗑 Удалена услуга"};
const fieldLabels:Record<string,string>={name:"название",title:"название",description:"описание",priceMode:"режим цены",priceFrom:"стоимость",features:"состав услуги",detailText:"системные блоки",status:"статус",published:"публикация",isVisible:"видимость",items:"состав"};
function telegramText(event:string,entityType:string,entityId:string,payload:Row){
  const lines=[eventLabels[event]??`ONIKART · ${event.replaceAll('_',' ')}`,''];
  if(event==='LEAD_CREATED'){lines.push(`Имя: ${clean(payload.name,100)}`,`Телефон: ${clean(payload.phone,30)}`);if(payload.message)lines.push('',`Задача:\n«${clean(payload.message,700)}»`);}
  else if(event==='VISITOR_MESSAGE')lines.push('Посетитель написал:',`«${clean(payload.text,900)}»`,'',`Диалог: #${entityId.slice(0,8)}`);
  else if(event==='RATING_SUBMITTED'){const score=Math.max(0,Math.min(5,Number(payload.score)||0));lines.push('★'.repeat(score)+'☆'.repeat(5-score),`${score} / 5`);if(payload.comment)lines.push('',`Комментарий:\n«${clean(payload.comment,500)}»`);lines.push('',`Диалог: #${entityId.slice(0,8)}`);}
  else {const title=clean(payload.title??payload.name,160);if(title)lines.push(title,'');const fields=Array.isArray(payload.fields)?payload.fields.map(String).map(key=>fieldLabels[key]??key).slice(0,10):[];if(fields.length)lines.push('Изменено:',...fields.map(field=>`• ${field}`));}
  lines.push('',new Intl.DateTimeFormat('ru-RU',{timeZone:'Europe/Moscow',day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date()).replace(' в ',' · '));
  const runtime=runtimeEnv();const base=runtime.NEXT_PUBLIC_SITE_URL?.replace(/\/$/,'');const route=entityType==='lead'?'/admin/leads':entityType==='conversation'?'/admin/dialogs':entityType==='works'?'/admin/works':entityType==='tariffs'?'/admin/tariffs':entityType==='services'?'/admin/services':'';if(base&&route)lines.push('',`Открыть в админке: ${base}${route}`);
  return lines.join('\n').slice(0,3900);
}
export async function recordEvent(event: string, entityType: string, entityId: string, payload: Row, actor = "system") {
  const safePayload = JSON.stringify(payload, (key, value) => /token|password|secret|session/i.test(key) ? undefined : value);
  const audit = database().prepare("INSERT INTO audit_logs (id,actor,action,entity_type,entity_id,metadata) VALUES (?,?,?,?,?,?)").bind(id(), actor, event, entityType, entityId, safePayload);
  const notificationId = id();
  const notification = database().prepare("INSERT INTO notification_events (id,category,event,entity_type,entity_id,payload) VALUES (?,?,?,?,?,?)").bind(notificationId, categories[event] ?? entityType.toUpperCase(), event, entityType, entityId, safePayload);
  await database().batch([audit, notification]);
  try { await dispatchTelegram(notificationId, event, entityType, entityId, payload); }
  catch { console.error('Notification status update failed'); }
}

async function dispatchTelegram(notificationId: string, event: string, entityType: string, entityId: string, payload: Row) {
  const runtime = runtimeEnv();
  if (!runtime.TELEGRAM_BOT_TOKEN || !runtime.TELEGRAM_ADMIN_CHAT_ID) {
    await database().prepare("UPDATE notification_events SET status='FAILED', error='NOT_CONFIGURED' WHERE id=?").bind(notificationId).run();
    return;
  }
  const text = telegramText(event,entityType,entityId,payload);
  try {
    const response = await fetch(`https://api.telegram.org/bot${runtime.TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chat_id: runtime.TELEGRAM_ADMIN_CHAT_ID, text }), signal:AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`HTTP_${response.status}`);
    await database().prepare("UPDATE notification_events SET status='SENT', attempts=attempts+1, sent_at=CURRENT_TIMESTAMP WHERE id=?").bind(notificationId).run();
  } catch (error) {
    const reason=error instanceof Error&&/^HTTP_\d{3}$/.test(error.message)?error.message:error instanceof Error&&error.name==='TimeoutError'?'TIMEOUT':'SEND_FAILED';
    await database().prepare("UPDATE notification_events SET status='FAILED', attempts=attempts+1, error=? WHERE id=?").bind(reason, notificationId).run();
  }
}

export async function recordMediaCleanupFailure(url:string,projectId:string){
  try {
    await database().prepare("INSERT INTO notification_events(id,category,event,entity_type,entity_id,payload,status,attempts,error) VALUES (?,?,?,?,?,?,'FAILED',1,'BLOB_DELETE_FAILED')")
      .bind(id(),'STORAGE','MEDIA_DELETE_FAILED','works',projectId,JSON.stringify({url})).run();
  } catch { console.error('Media cleanup failure could not be recorded'); }
}
