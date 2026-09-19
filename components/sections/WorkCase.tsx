import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SystemAccordion, type SystemItem } from "@/components/ui/SystemAccordion";
import { all, one } from "@/lib/platform";

type Project={title:string;slug:string;short_description:string;status:string;service_tags:string};
export async function WorkCase() {
  const project=await one<Project>("SELECT title,slug,short_description,status,service_tags FROM projects WHERE published=1 AND featured=1 ORDER BY featured_order LIMIT 1");
  const blocks=project?await all<{id:string;data:string}>("SELECT id,data FROM project_blocks WHERE project_id=(SELECT id FROM projects WHERE slug=?) AND type='SYSTEM_ITEM' AND visible=1 ORDER BY sort_order",project.slug):[];
  const systemItems:SystemItem[]=blocks.map((block,index)=>{const data=JSON.parse(block.data) as {number?:string;title?:string;shortText?:string;detailText?:string};return {id:block.id,number:data.number||String(index+1).padStart(2,'0'),title:data.title||'',shortText:data.shortText,detailText:data.detailText||data.shortText||''}});
  return (
    <>
      <section className="work-intro" id="work">
        <div className="container work-intro__inner">
          <SectionLabel>SELECTED WORK</SectionLabel>
          <Reveal><h2 className="display display--center">РАБОТА ГОВОРИТ<br /><span>ЛУЧШЕ ОБЕЩАНИЙ.</span></h2></Reveal>
        </div>
      </section>
      {project&&<section className="section featured-case">
        <div className="container">
          <div className="case-heading"><span>CASE / 001</span><span>SELECTED WORK</span></div>
          <p className="project-status"><i /> {project.status==='IN_PROGRESS'?'В РАБОТЕ':'ЗАВЕРШЕНО'}</p>
          <Reveal><h2 className="case-title">{project.title}</h2></Reveal>
          <p className="case-subtitle">{project.short_description}</p>
          <div className="case-mockup" role="img" aria-label={`Превью проекта ${project.title}`}>
            <div className="mockup-browser"><span>{project.slug.toUpperCase()} / PROJECT PREVIEW</span><div className="mockup-screen">{/* <b>{project.title}</b><small>{(JSON.parse(project.service_tags) as string[]).join(' / ')}</small>*/}
              <img src="/images/fasadof.png" alt="" />
              </div></div>
          </div>
          <div className="case-details">
            <div><span>ЗАДАЧА</span><p>Создать не просто представительский сайт, а основу цифровой системы компании.</p></div>
            <div><span>СИСТЕМА</span><p>Brand, web, каталог, admin, backend, MAX-уведомления, social, аналитика и production-инфраструктура.</p></div>
            <div><span>РОЛЬ</span><p>Strategy · Design · Development · Infrastructure</p></div>
          </div>
          <a className="case-link" href={`/work/${project.slug}`}>Смотреть кейс <span aria-hidden="true">↗</span></a>
        </div>
      </section>}
      <section className="section case-system">
        <div className="container">
          <Reveal><h2 className="display">ЗА ФАСАДОМ —<br /><span>ЦЕЛАЯ СИСТЕМА.</span></h2></Reveal>
          <SystemAccordion items={systemItems}/>
        </div>
      </section>
      <section className="statement">
        <div className="container statement__inner">
          <Reveal><h2>НЕ СОБИРАЮ САЙТЫ.<br /><span>СТРОЮ СИСТЕМЫ.</span></h2></Reveal>
          <p>Дизайн, код и автоматизация должны работать как единое целое — поэтому я смотрю на проект шире одной страницы в браузере.</p>
          <div>STRATEGY <i>→</i> DESIGN <i>→</i> DEVELOPMENT <i>→</i> AUTOMATION</div>
        </div>
      </section>
    </>
  );
}
