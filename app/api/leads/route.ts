import { clean, database, id, json, recordEvent } from "@/lib/platform";
const attempts = new Map<string, { count: number; reset: number }>();
export async function POST(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") ?? "local"; const now = Date.now(); const hit = attempts.get(ip) ?? { count: 0, reset: now + 60_000 };
  if (now > hit.reset) { hit.count = 0; hit.reset = now + 60_000; } if (++hit.count > 5) return json({ error: "Слишком много попыток. Попробуйте позже." }, 429); attempts.set(ip, hit);
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const name = clean(body.name, 100); const digits = clean(body.phone, 30).replace(/\D/g, ""); const message = clean(body.message, 3000);
  if (name.length < 2 || digits.length < 10) return json({ error: "Укажите имя и корректный номер телефона." }, 400);
  const leadId = id(); await database().prepare("INSERT INTO leads (id,name,phone,message,source,utm,page) VALUES (?,?,?,?,?,?,?)").bind(leadId, name, `+${digits}`, message || null, clean(body.source,100)||"website", clean(body.utm,500)||null, clean(body.page,300)||"/").run();
  await recordEvent("LEAD_CREATED", "lead", leadId, { name, phone: `+${digits}`, message, page: clean(body.page,300)||"/" });
  return json({ ok: true, id: leadId }, 201);
}
