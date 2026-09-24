import { can, readAdmin } from "@/lib/admin-auth";
import { all, clean, database, id, json, recordEvent, recordMediaCleanupFailure } from "@/lib/platform";
import { mediaStorage } from "@/lib/storage";

type Body = Record<string, unknown>;
const slugify = (value: unknown) => clean(value, 120).toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-|-$/g, "") || id().slice(0, 8);
const list = (value: unknown) => Array.isArray(value) ? value.map(item => clean(item, 200)).filter(Boolean) : clean(value, 3000).split(/\r?\n|,/).map(item => item.trim()).filter(Boolean);
async function access(resource:string,mode:'view'|'edit'){const identity=await readAdmin();return identity&&can(identity,`${resource}.${mode}`)?identity:null}

export async function GET(request: Request) {
  const resource = new URL(request.url).searchParams.get("resource");
  const queries: Record<string, string> = {
    works: "SELECT p.*,COALESCE((SELECT jsonb_agg(data ORDER BY sort_order) FROM project_blocks WHERE project_id=p.id AND type='SYSTEM_ITEM'),'[]'::jsonb) AS system_items FROM projects p ORDER BY featured_order,updated_at DESC",
    tariffs: "SELECT * FROM tariffs ORDER BY sort_order,updated_at DESC",
    services: "SELECT * FROM services ORDER BY sort_order,updated_at DESC",
    leads: "SELECT * FROM leads ORDER BY created_at DESC",
    settings: "SELECT * FROM settings ORDER BY key",
  };
  if (!resource || !queries[resource]) return json({ error: "Неизвестный раздел." }, 400);
  if (!await access(resource,'view')) return json({ error: "Недостаточно прав." }, 403);
  return json({ rows: await all(queries[resource]) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as Body; const resource = clean(body.resource, 40); const data = (body.data ?? {}) as Body; const entityId = id();
  const admin = await access(resource,'edit'); if (!admin) return json({ error: "Недостаточно прав." }, 403);
  if (resource === "works") {
    const title = clean(data.title, 160), description = clean(data.description, 1000); if (!title || !description) return json({ error: "Название и описание обязательны." }, 400);
    await database().prepare("INSERT INTO projects(id,title,slug,short_description,status,published,featured,featured_order,service_tags,seo_title,seo_description) VALUES(?,?,?,?,?,?,?,?,?,?,?)").bind(entityId,title,slugify(data.slug||title),description,data.status==='DONE'?'DONE':'IN_PROGRESS',Boolean(data.published),Boolean(data.featured),Number(data.order)||0,JSON.stringify(list(data.tags)),clean(data.seoTitle,160)||null,clean(data.seoDescription,300)||null).run();
  } else if (resource === "tariffs") {
    const name=clean(data.name,160),description=clean(data.description,1000); if(!name||!description)return json({error:"Название и описание обязательны."},400);
    await database().prepare("INSERT INTO tariffs(id,name,slug,eyebrow,description,price_mode,price_from,features,highlighted,badge,cta,sort_order,is_visible) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(entityId,name,slugify(data.slug||name),clean(data.eyebrow,20),description,data.priceMode==='INDIVIDUAL'?'INDIVIDUAL':'FROM',Number(data.priceFrom)||null,JSON.stringify(list(data.features)),Boolean(data.highlighted),clean(data.badge,80)||null,clean(data.cta,100)||'Обсудить проект',Number(data.order)||0,data.isVisible!==false).run();
  } else if (resource === "services") {
    const title=clean(data.title,160),description=clean(data.description,1000);if(!title||!description)return json({error:"Название и описание обязательны."},400);
    await database().prepare("INSERT INTO services(id,number,kicker,title,slug,description,items,sort_order,is_visible) VALUES(?,?,?,?,?,?,?,?,?)").bind(entityId,clean(data.number,10)||'01',clean(data.kicker,100)||'SERVICE',title,slugify(data.slug||title),description,JSON.stringify(list(data.items)),Number(data.order)||0,data.isVisible!==false).run();
  } else return json({ error: "Неизвестный раздел." }, 400);
  await recordEvent(`${resource.toUpperCase()}_CREATED`, resource, entityId, { title: data.title ?? data.name }, admin.email);
  return json({ ok: true, id: entityId }, 201);
}

export async function PATCH(request: Request) {
  const body=await request.json().catch(()=>({})) as Body;const resource=clean(body.resource,40),entityId=clean(body.id,80),data=(body.data??{}) as Body;const admin=await access(resource,'edit');if(!admin)return json({error:"Недостаточно прав."},403);if(!entityId)return json({error:"ID обязателен."},400);
  if(resource==='works'){
    await database().prepare("UPDATE projects SET title=?,short_description=?,status=?,published=?,featured=?,featured_order=?,service_tags=?,seo_title=?,seo_description=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(clean(data.title,160),clean(data.description,1000),data.status==='DONE'?'DONE':'IN_PROGRESS',Boolean(data.published),Boolean(data.featured),Number(data.order)||0,JSON.stringify(list(data.tags)),clean(data.seoTitle,160)||null,clean(data.seoDescription,300)||null,entityId).run();
    if(typeof data.systemItems==='string'){
      const rows=String(data.systemItems).split(/\r?\n/).map(line=>line.split('|').map(part=>clean(part,1200))).filter(parts=>parts[0]);
      const statements=[database().prepare("DELETE FROM project_blocks WHERE project_id=? AND type='SYSTEM_ITEM'").bind(entityId),...rows.map((parts,index)=>database().prepare("INSERT INTO project_blocks(id,project_id,type,data,sort_order,visible) VALUES(?,?,?,?,?,true)").bind(id(),entityId,'SYSTEM_ITEM',JSON.stringify({number:String(index+1).padStart(2,'0'),title:parts[0],shortText:parts[1]||'',detailText:parts.slice(2).join('|')||parts[1]||''}),index+1))];
      await database().batch(statements);
    }
  }
  else if(resource==='tariffs')await database().prepare("UPDATE tariffs SET name=?,eyebrow=?,description=?,price_mode=?,price_from=?,features=?,highlighted=?,badge=?,cta=?,sort_order=?,is_visible=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(clean(data.name,160),clean(data.eyebrow,20),clean(data.description,1000),data.priceMode==='INDIVIDUAL'?'INDIVIDUAL':'FROM',Number(data.priceFrom)||null,JSON.stringify(list(data.features)),Boolean(data.highlighted),clean(data.badge,80)||null,clean(data.cta,100)||'Обсудить проект',Number(data.order)||0,data.isVisible!==false,entityId).run();
  else if(resource==='services')await database().prepare("UPDATE services SET number=?,kicker=?,title=?,description=?,items=?,sort_order=?,is_visible=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(clean(data.number,10),clean(data.kicker,100),clean(data.title,160),clean(data.description,1000),JSON.stringify(list(data.items)),Number(data.order)||0,data.isVisible!==false,entityId).run();
  else if(resource==='leads')await database().prepare("UPDATE leads SET status=?,notes=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(['NEW','IN_PROGRESS','DONE'].includes(String(data.status))?data.status:'NEW',clean(data.notes,2000)||null,entityId).run();
  else if(resource==='settings'){const key=clean(data.key,100),value=clean(data.value,3000);if(!key)return json({error:'Ключ обязателен.'},400);await database().prepare("INSERT INTO settings(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP").bind(key,value).run();}
  else return json({error:"Неизвестный раздел."},400);
  await recordEvent(`${resource.toUpperCase()}_UPDATED`,resource,entityId,{fields:Object.keys(data)},admin.email);return json({ok:true});
}

export async function DELETE(request: Request) {
  const body=await request.json().catch(()=>({})) as Body;const resource=clean(body.resource,40),entityId=clean(body.id,80);const admin=await access(resource,'edit');if(!admin)return json({error:"Недостаточно прав."},403);if(!entityId)return json({error:"ID обязателен."},400);
  const tables:Record<string,string>={works:'projects',tariffs:'tariffs',services:'services',leads:'leads'};const table=tables[resource];if(!table)return json({error:"Неизвестный раздел."},400);
  if(resource==='works'){
    const covers=await all<{media_url:string}>("SELECT media_url FROM project_media WHERE project_id=?",entityId);
    const project=await database().prepare("SELECT cover FROM projects WHERE id=?").bind(entityId).first<{cover:string|null}>();
    const urls=new Set([project?.cover,...covers.map(row=>row.media_url)].filter((value):value is string=>Boolean(value)));
    await database().batch([...['project_links','project_blocks','project_media'].map(name=>database().prepare(`DELETE FROM ${name} WHERE project_id=?`).bind(entityId)),database().prepare("DELETE FROM projects WHERE id=?").bind(entityId)]);
    for(const url of urls)await mediaStorage.remove(url).catch(()=>recordMediaCleanupFailure(url,entityId));
  }else await database().prepare(`DELETE FROM ${table} WHERE id=?`).bind(entityId).run();
  await recordEvent(`${resource.toUpperCase()}_DELETED`,resource,entityId,{},admin.email);return json({ok:true});
}
