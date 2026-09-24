import { requirePermission } from "@/lib/admin-auth";
import { database, id, json, recordMediaCleanupFailure } from "@/lib/platform";
import { mediaStorage, validProjectId, type MediaExtension } from "@/lib/storage";

const types:Record<string,MediaExtension>={"image/png":"png","image/jpeg":"jpg","image/webp":"webp"};
// The Vercel Function request-body limit is 4.5 MB, including multipart overhead.
const maxBytes=4*1024*1024;

export async function POST(request:Request){
  const admin=await requirePermission("works.edit");
  if(!admin)return json({error:"Недостаточно прав."},403);
  const form=await request.formData().catch(()=>null);
  const projectId=String(form?.get("projectId")??"");
  const file=form?.get("file");
  if(!validProjectId(projectId)||!(file instanceof File))return json({error:"Проект и изображение обязательны."},400);
  const project=await database().prepare("SELECT id,cover FROM projects WHERE id=?").bind(projectId).first<{id:string;cover:string|null}>();
  if(!project)return json({error:"Проект не найден."},404);
  const extension=types[file.type];
  if(!extension||file.size===0||file.size>maxBytes)return json({error:"Допустимы PNG, JPEG и WebP до 4 МБ."},400);
  const bytes=new Uint8Array(await file.arrayBuffer());
  const valid=extension==='png'?bytes.length>8&&[137,80,78,71,13,10,26,10].every((value,index)=>bytes[index]===value):extension==='jpg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:bytes.length>12&&new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP';
  if(!valid)return json({error:"Содержимое файла не соответствует типу."},400);
  const previous=await database().prepare("SELECT media_url FROM project_media WHERE project_id=? AND device_type='COVER'").bind(projectId).all<{media_url:string}>();
  let url:string;
  try{url=await mediaStorage.upload(projectId,bytes,extension)}catch{console.error("media storage write failed");return json({error:"Хранилище медиа недоступно."},503)}
  try{
    await database().batch([
      database().prepare("DELETE FROM project_media WHERE project_id=? AND device_type='COVER'").bind(projectId),
      database().prepare("INSERT INTO project_media(id,project_id,device_type,media_url,alt,sort_order,visible) VALUES(?,?,?,?,?,?,true)").bind(id(),projectId,'COVER',url,String(form?.get('alt')??'').slice(0,200),0),
      database().prepare("UPDATE projects SET cover=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(url,projectId),
    ]);
  }catch{await mediaStorage.remove(url).catch(()=>recordMediaCleanupFailure(url,projectId));console.error("media database update failed");return json({error:"Не удалось сохранить изображение проекта."},500)}
  for(const oldUrl of new Set([project.cover,...previous.results.map(row=>row.media_url)].filter((value):value is string=>Boolean(value)))){
    if(oldUrl!==url)await mediaStorage.remove(oldUrl).catch(()=>recordMediaCleanupFailure(oldUrl,projectId));
  }
  return json({ok:true,url},201);
}
