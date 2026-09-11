import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { systemRows } from "@/data/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Фасадоф — кейс OnikArt",
  description: "Архитектура цифровой инфраструктуры для бизнеса фасадов и столешниц.",
  alternates: { canonical: "/work/fasadof/" },
  openGraph: { title: "Фасадоф — кейс OnikArt", description: "Цифровая инфраструктура для бизнеса фасадов и столешниц.", url: "/work/fasadof/", images: [{ url: "/og.png", width: 1200, height: 630, alt: "ONIKART. Цифровые системы для бизнеса." }] },
};

const sections = [
  ["КОНТЕКСТ", "Бизнесу нужна единая цифровая основа, которая связывает публичный сайт с каталогом, обращениями и дальнейшим развитием."],
  ["ЗАДАЧА", "Создать не просто представительский сайт, а основу цифровой системы компании."],
  ["РЕШЕНИЕ", "Спроектирована архитектура, в которой интерфейс, контент, заявки, аналитика и инфраструктура рассматриваются как части одного продукта."],
] as const;

export default function FasadofCase() {
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
            <div className="case-hero__meta"><span>Strategy</span><span>Design</span><span>Development</span><span>Infrastructure</span></div>
          </div>
        </section>
        <section className="case-canvas"><div className="container"><div className="case-canvas__frame"><span>ПРЕВЬЮ КЕЙСА</span><strong>ФАСАДОФ</strong><small>ФАСАДЫ · СТОЛЕШНИЦЫ · МАТЕРИАЛЫ</small></div></div></section>
        <section className="section case-narrative"><div className="container">{sections.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{copy}</p></article>)}</div></section>
        <section className="section case-system"><div className="container"><p className="section-label">СИСТЕМА</p><h2 className="display">ЗА ФАСАДОМ —<br /><span>ЦЕЛАЯ СИСТЕМА.</span></h2><div className="system-rows">{systemRows.map(([number, title, copy]) => <div className="system-row" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p><i aria-hidden="true">↗</i></div>)}</div></div></section>
        <section className="case-next"><div className="container"><span>ДАЛЬШЕ</span><Link href="/#work">Вернуться к работам <i aria-hidden="true">↗</i></Link></div></section>
      </main>
      <Footer />
    </>
  );
}
