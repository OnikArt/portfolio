import Image from "next/image";
import { sitePath } from "@/lib/deploy-target";
type Contact={label:string;href:string};
const iconFor=(item:Contact)=>item.href.startsWith('tel:')&&item.label.startsWith('+')?'/icons/phone.svg':item.label.startsWith('Telegram')?'/icons/telegram.svg':item.label.startsWith('MAX')?'/icons/max.webp':item.label==='VK'?'/icons/vk.svg':item.label==='Instagram'?'/icons/instagram.svg':null;
const accessible=(item:Contact)=>item.href.startsWith('tel:')?`Позвонить: ${item.label}`:item.label.replace(/ ·.*/,'');
export function ContactLink({item,compact=false}:{item:Contact;compact?:boolean}){const icon=iconFor(item);return <a className={`contact-link${compact?' contact-link--compact':''}`} href={item.href} aria-label={accessible(item)} target={item.href.startsWith('http')?'_blank':undefined} rel={item.href.startsWith('http')?'noopener noreferrer':undefined}>{icon&&<Image src={sitePath(icon)} alt="" width={20} height={20}/>}{/*<span>{item.label}</span> */}</a>}
