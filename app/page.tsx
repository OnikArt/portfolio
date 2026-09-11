import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PositioningServices } from "@/components/sections/PositioningServices";
import { WorkCase } from "@/components/sections/WorkCase";
import { ProcessAbout } from "@/components/sections/ProcessAbout";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">К содержанию</a>
      <Header />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero__grid">
            <div className="hero__content">
              <p className="eyebrow hero-reveal hero-reveal--1">ONIKART / DIGITAL SYSTEMS</p>
              <h1 id="hero-title" className="hero__title"><span className="hero-line"><span>НЕ ПРОСТО САЙТ.</span></span><span className="hero-line"><span>СИСТЕМА ДЛЯ</span></span><span className="hero-line"><span>БИЗНЕСА.</span></span></h1>
              <p className="hero__copy hero-reveal hero-reveal--5">Проектирую цифровую инфраструктуру бизнеса — от визуального образа и сайта до заявок, админ-панелей, аналитики, интеграций и автоматизации.</p>
              <div className="hero__actions hero-reveal hero-reveal--6"><a className="button button--primary" href="#contact">Обсудить проект <span aria-hidden="true">↗</span></a><a className="button button--text" href="#work">Смотреть работы <span aria-hidden="true">↓</span></a></div>
            </div>
            <div className="hero__visual hero-reveal hero-reveal--7" aria-hidden="true"><Image src="/images/onikart-hero-sculpture.webp" alt="" width={1024} height={1536} priority sizes="(max-width: 767px) 72vw, 40vw" /></div>
          </div>
          <div className="hero__index" aria-hidden="true">DESIGN / CODE / SYSTEMS / AUTOMATION</div>
        </section>
        <PositioningServices />
        <WorkCase />
        <ProcessAbout />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
