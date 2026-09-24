import { getPublicServices } from "@/lib/public-content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export async function PositioningServices() {
  const chain = ["БРЕНД", "САЙТ", "ЗАЯВКИ", "УПРАВЛЕНИЕ", "АНАЛИТИКА", "РОСТ"];
  const services = await getPublicServices();
  return (
    <>
      <section className="section section--light positioning">
        <div className="container">
          <SectionLabel dark>01 / ПОДХОД</SectionLabel>
          <div className="positioning__container">
            <Reveal>
              <h2 className="display display--dark">
                САЙТ —<br />
                ТОЛЬКО ЧАСТЬ
                <br />
                СИСТЕМЫ.
              </h2>
            </Reveal>
              <p className="positioning__copy">
                Я смотрю не только на внешний вид страницы. Мне важно, как
                пользователь приходит, куда отправляется заявка, кто её
                получает, как управляется контент и какие данные получает бизнес
                после запуска.
              </p>
          </div>
          <div className="system-chain" aria-label={chain.join(", затем ")}>
            {chain.map((item, index) => (
              <span key={item}>
                <b>{item}</b>
                {index < chain.length - 1 && <i aria-hidden="true">→</i>}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="section services" id="services">
        <div className="container">
          <SectionLabel>02 / ЧТО Я СОЗДАЮ</SectionLabel>
          <Reveal>
            <h2 className="display">
              ОДНА СИСТЕМА.
              <br />
              <span>ВСЕ НАПРАВЛЕНИЯ.</span>
            </h2>
          </Reveal>
          <div className="services__list">
            {services.map((service) => (
              <article className="service-panel" key={service.id}>
                <div className="service-panel__top">
                  <span>{service.number}</span>
                  <span>{service.kicker}</span>
                  <span className="window-controls" aria-label="Элементы управления окном">
                    <i className="window-control window-control--close" aria-hidden="true" />
                    <i className="window-control window-control--minimize" aria-hidden="true" />
                    <a className="window-control window-control--expand" href="#work-formats" aria-label="Перейти к форматам работы" />
                  </span>
                </div>
                <div className="service-panel__body">
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                  <ul>
                    {(JSON.parse(service.items) as string[]).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
