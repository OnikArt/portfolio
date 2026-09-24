import { HomeContent } from "@/components/sections/HomeContent";
import { Contact } from "@/components/sections/Contact";
import { ChatWidget } from "@/components/chat/ChatWidget";

export const dynamic = "force-dynamic";

export default function Home() {
  return <><HomeContent contact={<Contact/>}/><ChatWidget/></>;
}
