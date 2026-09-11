import Link from "next/link";
import { systemRows } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function WorkCase() {
  return (
    <>
      <section className="work-intro" id="work">
        <div className="container work-intro__inner">
          <SectionLabel>SELECTED WORK</SectionLabel>
          <Reveal><h2 className="display display--center">РАБОТА ГОВОРИТ<br /><span>ЛУЧШЕ ОБЕЩАНИЙ.</span></h2></Reveal>
        </div>
      </section>
      <section className="section featured-case">
        <div className="container">
          <div className="case-heading"><span>CASE / 001</span><span>SELECTED WORK</span></div>
          <Reveal><h2 className="case-title">ФАСАДОФ</h2></Reveal>
          <p className="case-subtitle">Цифровая инфраструктура для бизнеса фасадов и столешниц.</p>
          <div className="case-mockup" role="img" aria-label="Место для будущих экранов проекта Фасадоф">
            <div className="mockup-browser"><span>FASADOF / PROJECT PREVIEW</span><div className="mockup-screen"><b>ФАСАДЫ.</b><small>Материалы / формы / решения</small></div></div>
          </div>
          <div className="case-details">
            <div><span>ЗАДАЧА</span><p>Создать не просто представительский сайт, а основу цифровой системы компании.</p></div>
            <div><span>СИСТЕМА</span><p>Каталог, управление контентом, заявки, аналитика, интеграции и production-инфраструктура.</p></div>
            <div><span>РОЛЬ</span><p>Strategy · Design · Development · Infrastructure</p></div>
          </div>
          <Link className="case-link" href="/work/fasadof">Смотреть кейс <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <section className="section case-system">
        <div className="container">
          <Reveal><h2 className="display">ЗА ФАСАДОМ —<br /><span>ЦЕЛАЯ СИСТЕМА.</span></h2></Reveal>
          <div className="system-rows">
            {systemRows.map(([number, title, copy]) => <div className="system-row" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p><i aria-hidden="true">↗</i></div>)}
          </div>
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
