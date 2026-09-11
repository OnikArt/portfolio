import { services } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function PositioningServices() {
  const chain = ["БРЕНД", "САЙТ", "ЗАЯВКИ", "УПРАВЛЕНИЕ", "АНАЛИТИКА", "РОСТ"];
  return (
    <>
      <section className="section section--light positioning">
        <div className="container">
          <SectionLabel dark>01 / ПОДХОД</SectionLabel>
          <Reveal><h2 className="display display--dark">САЙТ —<br />ТОЛЬКО ЧАСТЬ<br />СИСТЕМЫ.</h2></Reveal>
          <div className="positioning__copy">
            <p>Я смотрю не только на внешний вид страницы. Мне важно, как пользователь приходит, куда отправляется заявка, кто её получает, как управляется контент и какие данные получает бизнес после запуска.</p>
          </div>
          <div className="system-chain" aria-label={chain.join(", затем ")}>
            {chain.map((item, index) => <span key={item}><b>{item}</b>{index < chain.length - 1 && <i aria-hidden="true">→</i>}</span>)}
          </div>
        </div>
      </section>
      <section className="section services" id="services">
        <div className="container">
          <SectionLabel>02 / ЧТО Я СОЗДАЮ</SectionLabel>
          <Reveal><h2 className="display">ОДНА СИСТЕМА.<br /><span>ТРИ НАПРАВЛЕНИЯ.</span></h2></Reveal>
          <div className="services__list">
            {services.map((service) => (
              <article className="service-panel" key={service.number}>
                <div className="service-panel__top"><span>{service.number}</span><span>{service.kicker}</span><span aria-hidden="true">↗</span></div>
                <div className="service-panel__body">
                  <div><h3>{service.title}</h3><p>{service.description}</p></div>
                  <ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
