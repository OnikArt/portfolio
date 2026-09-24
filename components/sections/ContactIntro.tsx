import { ContactLink } from "@/components/ui/ContactLink";
import { getPublicSettings } from "@/lib/public-settings";

export function ContactIntro() {
  const settings = getPublicSettings();
  return <div>
    <p className="section-label section-label--dark">ЕСТЬ ЗАДАЧА?</p>
    <h2><span>ДАВАЙТЕ ОБСУДИМ</span><span>ВАШ ПРОЕКТ.</span></h2>
    <p className="contact__copy">
      {[...settings.contacts, ...settings.socialLinks].map(item => <span key={item.label}><ContactLink item={item}/><br/></span>)}
    </p>
  </div>;
}
