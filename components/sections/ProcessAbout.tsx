import { processSteps, technologies } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const principles = [
  ["01", "ПОНИМАНИЕ ЗАДАЧИ", "Сначала разбираю задачу бизнеса, а уже потом выбираю решение."],
  ["02", "ПРОЗРАЧНЫЙ ПРОЦЕСС", "Понятные этапы, решения и статус проекта."],
  ["03", "СИСТЕМА С ЗАПАСОМ", "Проект можно развивать без необходимости каждый раз начинать всё заново."],
  ["04", "ОДНА ТОЧКА ОТВЕТСТВЕННОСТИ", "Дизайн, разработка, интеграции и запуск связаны между собой."],
] as const;

export function ProcessAbout() {
  return (
    <>
      <section className="section process" id="process">
        <div className="container process__grid">
          <div className="process__intro">
            <SectionLabel>03 / ПРОЦЕСС</SectionLabel>
            <Reveal><h2 className="display display--medium">ОТ ЗАДАЧИ<br /><span>ДО СИСТЕМЫ.</span></h2></Reveal>
            <div className="process__range" aria-hidden="true">01—06</div>
          </div>
          <ol className="process__steps">
            {processSteps.map(([number, title, copy]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}
          </ol>
        </div>
      </section>
      <section className="section principles">
        <div className="container">
          <Reveal><h2 className="display">НЕ БОЛЬШЕ ФУНКЦИЙ.<br /><span>БОЛЬШЕ СМЫСЛА.</span></h2></Reveal>
          <div className="principles__grid">
            {principles.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </div>
      </section>
      <section className="section technologies">
        <div className="container technologies__grid">
          <Reveal><h2 className="display display--medium">ТЕХНОЛОГИИ —<br /><span>НЕ ПРОДУКТ.</span></h2></Reveal>
          <div><p>Я выбираю инструменты под задачу, а не задачу под любимый стек.</p><ul>{technologies.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </section>
      <section className="section section--light about" id="about">
        <div className="container">
          <SectionLabel dark>04 / ОБО МНЕ</SectionLabel>
          <div className="about__grid">
            <div className="portrait-placeholder" role="img" aria-label="Место для портрета Оника Артушяна"><span>OA</span></div>
            <div className="about__content">
              <Reveal><h2 className="display display--dark display--medium">ЧЕЛОВЕК<br />ЗА ONIKART.</h2></Reveal>
              <h3>Оник Артушян</h3>
              <p>Создаю цифровые системы для бизнеса — от идеи и визуального образа до работающего продукта, инфраструктуры и дальнейшего развития.</p>
              <p>Мне важно не просто закончить макет или написать код. Я хочу понимать, какую задачу решает каждый элемент системы и как с ней будут работать после запуска.</p>
              <div className="tags"><span>DESIGN</span><span>DEVELOPMENT</span><span>AI</span><span>AUTOMATION</span><span>ANALYTICS</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="section fit">
        <div className="container">
          <Reveal><h2 className="display display--medium">ЧТО ВЫ ПОЛУЧАЕТЕ<br /><span>В РАБОТЕ С ONIKART.</span></h2></Reveal>
          <div className="fit__grid">{principles.map(([n,t,c])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></article>)}</div>
        </div>
      </section>
    </>
  );
}
