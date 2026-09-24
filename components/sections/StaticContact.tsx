import { ContactIntro } from "@/components/sections/ContactIntro";
import { getPublicSettings } from "@/lib/public-settings";

export function StaticContact() {
  return <section className="contact" id="contact"><div className="container contact__grid">
    <ContactIntro />
    <div className="contact-form">
      <p>Напишите мне напрямую — в этой статической версии заявки через сайт не отправляются.</p>
      {getPublicSettings().contacts.map(item => <a key={item.href} className="button button--primary" href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>{item.label} <span aria-hidden="true">↗</span></a>)}
    </div>
  </div></section>;
}
