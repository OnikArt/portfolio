import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  SystemAccordion,
  type SystemItem,
} from "@/components/ui/SystemAccordion";
import { getPublicProjectBySlug, getPublicProjectBlocks } from "@/lib/public-content";
import { can, readAdmin } from "@/lib/admin-auth";
import { sitePath } from "@/lib/deploy-target";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ preview?: string }> };

async function visibleProject(preview?: string) {
  const project = await getPublicProjectBySlug("fasadof");
  if (!project) notFound();
  if (!project.published) {
    const admin = preview === "1" ? await readAdmin() : null;
    if (!admin || !can(admin, "works.view")) notFound();
  }
  return project;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { preview } = await searchParams;
  const project = await visibleProject(preview);
  const title = project.seo_title || "Фасадоф — кейс OnikArt";
  const description = project.seo_description || project.short_description;
  return {
    title,
    description,
    robots: !project.published || preview === "1" ? { index: false, follow: false } : undefined,
    alternates: { canonical: "/work/fasadof/" },
    openGraph: { title, description, url: "/work/fasadof/", images: [{ url: project.cover || "/images/og.png" }] },
  };
}

const sections = [
  [
    "КОНТЕКСТ",
    "Бизнесу нужна единая цифровая основа, которая связывает публичный сайт с каталогом, обращениями и дальнейшим развитием.",
  ],
  [
    "ЗАДАЧА",
    "Создать не просто представительский сайт, а основу цифровой системы компании.",
  ],
  [
    "РЕШЕНИЕ",
    "Спроектирована архитектура, в которой интерфейс, контент, заявки, аналитика и инфраструктура рассматриваются как части одного продукта.",
  ],
] as const;

export default async function FasadofCase({ searchParams }: Props) {
  const { preview } = await searchParams;
  const project = await visibleProject(preview);
  const blocks = await getPublicProjectBlocks("fasadof");
  const systemItems: SystemItem[] = blocks.map((block, index) => {
    const data = JSON.parse(block.data) as {
      number?: string;
      title?: string;
      shortText?: string;
      detailText?: string;
    };
    return {
      id: block.id,
      number: data.number || String(index + 1).padStart(2, "0"),
      title: data.title || "",
      shortText: data.shortText,
      detailText: data.detailText || data.shortText || "",
    };
  });
  return (
    <>
      <a className="skip-link" href="#case-main">
        К содержанию
      </a>
      <Header />
      <main id="case-main" className="case-page">
        <section className="case-hero">
          <div className="container">
            <div className="case-heading">
              <span>CASE / 001</span>
              <span>ONIKART / SELECTED WORK</span>
            </div>
            <h1>{project.title.toUpperCase()}</h1>
            <p>{project.subtitle || project.short_description}</p>
            <div className="project-status">
              <i /> {project.status === "DONE" ? "ЗАВЕРШЕНО" : "В РАБОТЕ · Система продолжает развиваться"}
            </div>
            <div className="case-hero__meta">
              <span>Strategy</span>
              <span>Design</span>
              <span>Development</span>
              <span>Infrastructure</span>
            </div>
          </div>
        </section>
        <section className="case-canvas">
          <div className="container">
            <div className="device-showcase">
              <div className="device device--desktop">
                <div className="device__bar">FASADOF / WEB SYSTEM</div>
                <div className="device__screen">
                  {/* <strong>ФАСАДОФ</strong><small>ФАСАДЫ · СТОЛЕШНИЦЫ · МАТЕРИАЛЫ</small>*/}
                  <img src={sitePath("/images/fasadof.png")} alt="" />
                </div>
              </div>
              <div className="device device--phone">
                <div className="device__screen">
                  <img src={sitePath("/images/fasadofMobile.png")} alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section case-narrative">
          <div className="container">
            {sections.map(([title, copy], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h2>{title}</h2>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section case-system">
          <div className="container">
            <p className="section-label">СИСТЕМА</p>
            <h2 className="display">
              ЗА ФАСАДОМ —<br />
              <span>ЦЕЛАЯ СИСТЕМА.</span>
            </h2>
            <SystemAccordion items={systemItems} />
          </div>
        </section>
        <section className="section case-directions">
          <div className="container">
            <p className="section-label">НАПРАВЛЕНИЯ РАБОТЫ</p>
            {[
              [
                "BRAND",
                "Индивидуальный визуальный дизайн, brand system и полноценный брендбук с нуля.",
              ],
              [
                "WEB",
                "Публичный сайт, responsive design, каталог, карточки продукции и business sections.",
              ],
              [
                "SYSTEM",
                "Backend, database, custom admin, заявки, analytics и внутренние процессы.",
              ],
              [
                "MAX",
                "Собственная bot / notification system: ключевые действия передаются через бот; публичное MAX-сообщество встроено в digital ecosystem.",
              ],
              [
                "SOCIAL",
                "Создание, оформление и дальнейшее ведение социальных каналов как части одной системы.",
              ],
              [
                "ANALYTICS",
                "Tracking, sources, events и operational analytics без выдуманных показателей.",
              ],
              [
                "INFRASTRUCTURE",
                "Production, deployment, persistent data и основа для дальнейшего развития.",
              ],
              [
                "COOPERATION",
                "После запуска работа не остановилась: добавляются функции, каналы, интеграции и инструменты бизнеса.",
              ],
            ].map(([title, copy], i) => (
              <article key={title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h2>{title}</h2>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="case-next">
          <div className="container">
            <span>ДАЛЬШЕ</span>
            <a href={sitePath("/#work")}>
              Вернуться к работам <i aria-hidden="true">↗</i>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
