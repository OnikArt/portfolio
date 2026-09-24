import { siteSettings } from "@/data/site";
import { ContactLink } from "@/components/ui/ContactLink";
import { isPagesBuild, sitePath } from "@/lib/deploy-target";

export function Footer() {
  const year = new Date().getFullYear();
  return <footer className="footer"><div className="container">
    <div className="footer__top"><a className="wordmark" href={sitePath("/")}>ONIKART</a><p>Digital systems for business.</p></div>
    <nav aria-label="Навигация в подвале"><a href={sitePath("/#work")}>Работы</a><a href={sitePath("/#services")}>Услуги</a><a href={sitePath("/#work-formats")}>Форматы работы</a><a href={sitePath("/#process")}>Подход</a><a href={sitePath("/#about")}>Обо мне</a></nav>
    <div className="footer-contacts">{[...siteSettings.contacts,...siteSettings.socialLinks].map(item=><ContactLink key={item.label} item={item} compact/>)}{!isPagesBuild&&<a href="/admin">Админ-панель ↗</a>}<a href={sitePath("/privacy/")}>Privacy</a></div>
    <div className="footer__bottom"><span>© {year} ONIKART</span><span>{siteSettings.location}</span></div>
  </div></footer>;
}
