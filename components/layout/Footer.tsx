import { siteSettings } from "@/data/site";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top"><Link className="wordmark" href="/">ONIKART</Link><p>Digital systems for business.</p></div>
        <nav aria-label="Навигация в подвале"><Link href="/#work">Работы</Link><Link href="/#services">Услуги</Link><Link href="/#process">Подход</Link><Link href="/#about">Обо мне</Link></nav>
        <div className="footer-contacts">{[...siteSettings.contacts,...siteSettings.socialLinks].map(x=><a key={x.label} href={x.href} target={x.href.startsWith('http')?'_blank':undefined} rel={x.href.startsWith('http')?'noopener noreferrer':undefined}>{x.label}</a>)}<Link href="/admin">Админ-панель ↗</Link><Link href="/privacy">Privacy</Link></div><div className="footer__bottom"><span>© {year} ONIKART</span><span>{siteSettings.location}</span></div>
      </div>
    </footer>
  );
}
