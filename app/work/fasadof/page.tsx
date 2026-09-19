import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SystemAccordion, type SystemItem } from "@/components/ui/SystemAccordion";
import { all } from "@/lib/platform";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Фасадоф — кейс OnikArt",
  description: "Архитектура цифровой инфраструктуры для бизнеса фасадов и столешниц.",
  alternates: { canonical: "/work/fasadof/" },
  openGraph: { title: "Фасадоф — кейс OnikArt", description: "Цифровая инфраструктура для бизнеса фасадов и столешниц.", url: "/work/fasadof/", images: [{ url: "/images/og.png", width: 1200, height: 630, alt: "ONIKART. Цифровые системы для бизнеса." }] },
};

const sections = [
  ["КОНТЕКСТ", "Бизнесу нужна единая цифровая основа, которая связывает публичный сайт с каталогом, обращениями и дальнейшим развитием."],
  ["ЗАДАЧА", "Создать не просто представительский сайт, а основу цифровой системы компании."],
  ["РЕШЕНИЕ", "Спроектирована архитектура, в которой интерфейс, контент, заявки, аналитика и инфраструктура рассматриваются как части одного продукта."],
] as const;

export default async function FasadofCase() {
  const blocks=await all<{id:string;data:string}>("SELECT id,data FROM project_blocks WHERE project_id=(SELECT id FROM projects WHERE slug='fasadof') AND type='SYSTEM_ITEM' AND visible=1 ORDER BY sort_order");
  const systemItems:SystemItem[]=blocks.map((block,index)=>{const data=JSON.parse(block.data) as {number?:string;title?:string;shortText?:string;detailText?:string};return {id:block.id,number:data.number||String(index+1).padStart(2,'0'),title:data.title||'',shortText:data.shortText,detailText:data.detailText||data.shortText||''}});
  return (
    <>
      <a className="skip-link" href="#case-main">К содержанию</a>
      <Header />
      <main id="case-main" className="case-page">
        <section className="case-hero">
          <div className="container">
            <div className="case-heading"><span>CASE / 001</span><span>ONIKART / SELECTED WORK</span></div>
            <h1>ФАСАДОФ</h1>
            <p>Цифровая инфраструктура для бизнеса фасадов и столешниц.</p>
            <div className="project-status"><i /> В РАБОТЕ · Система продолжает развиваться</div>
            <div className="case-hero__meta"><span>Strategy</span><span>Design</span><span>Development</span><span>Infrastructure</span></div>
          </div>
        </section>
        <section className="case-canvas"><div className="container"><div className="device-showcase"><div className="device device--desktop"><div className="device__bar">FASADOF / WEB SYSTEM</div><div className="device__screen">{/* <strong>ФАСАДОФ</strong><small>ФАСАДЫ · СТОЛЕШНИЦЫ · МАТЕРИАЛЫ</small>*/}
          <img src="/images/fasadof.png" alt="" />
          </div></div><div className="device device--phone"><div className="device__screen"><strong>Ф.</strong><small>CATALOG</small></div></div></div></div></section>
        <section className="section case-narrative"><div className="container">{sections.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{copy}</p></article>)}</div></section>
        <section className="section case-system"><div className="container"><p className="section-label">СИСТЕМА</p><h2 className="display">ЗА ФАСАДОМ —<br /><span>ЦЕЛАЯ СИСТЕМА.</span></h2><SystemAccordion items={systemItems}/></div></section>
        <section className="section case-directions"><div className="container"><p className="section-label">НАПРАВЛЕНИЯ РАБОТЫ</p>{[
          ['BRAND','Индивидуальный визуальный дизайн, brand system и полноценный брендбук с нуля.'],
          ['WEB','Публичный сайт, responsive design, каталог, карточки продукции и business sections.'],
          ['SYSTEM','Backend, database, custom admin, заявки, analytics и внутренние процессы.'],
          ['MAX','Собственная bot / notification system: ключевые действия передаются через бот; публичное MAX-сообщество встроено в digital ecosystem.'],
          ['SOCIAL','Создание, оформление и дальнейшее ведение социальных каналов как части одной системы.'],
          ['ANALYTICS','Tracking, sources, events и operational analytics без выдуманных показателей.'],
          ['INFRASTRUCTURE','Production, deployment, persistent data и основа для дальнейшего развития.'],
          ['COOPERATION','После запуска работа не остановилась: добавляются функции, каналы, интеграции и инструменты бизнеса.']
        ].map(([title,copy],i)=><article key={title}><span>{String(i+1).padStart(2,'0')}</span><h2>{title}</h2><p>{copy}</p></article>)}</div></section>
        <section className="case-next"><div className="container"><span>ДАЛЬШЕ</span><a href="/#work">Вернуться к работам <i aria-hidden="true">↗</i></a></div></section>
      </main>
      <Footer />
    </>
  );
}
