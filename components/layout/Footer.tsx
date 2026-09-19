import { siteSettings } from "@/data/site";
import { ContactLink } from "@/components/ui/ContactLink";

export function Footer() {
  const year = new Date().getFullYear();
  return <footer className="footer"><div className="container">
    <div className="footer__top"><a className="wordmark" href="/">ONIKART</a><p>Digital systems for business.</p></div>
    <nav aria-label="Навигация в подвале"><a href="/#work">Работы</a><a href="/#services">Услуги</a><a href="/#work-formats">Форматы работы</a><a href="/#process">Подход</a><a href="/#about">Обо мне</a></nav>
    <div className="footer-contacts">{[...siteSettings.contacts,...siteSettings.socialLinks].map(item=><ContactLink key={item.label} item={item} compact/>)}<a href="/admin">Админ-панель ↗</a><a href="/privacy">Privacy</a></div>
    <div className="footer__bottom"><span>© {year} ONIKART</span><span>{siteSettings.location}</span></div>
  </div></footer>;
}
