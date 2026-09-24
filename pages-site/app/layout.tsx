import type { Metadata } from "next";
import "@/app/globals.css";
import { sitePath } from "@/lib/deploy-target";

const origin = process.env.PAGES_SITE_URL?.replace(/\/$/, "");
export const metadata: Metadata = {
  ...(origin ? { metadataBase: new URL(`${origin}/`), alternates: { canonical: `${origin}/` } } : {}),
  title: "OnikArt — цифровые системы для бизнеса",
  description: "Создание сайтов и цифровой инфраструктуры для бизнеса: дизайн, разработка, админ-панели, аналитика, интеграции и автоматизация.",
  openGraph: {
    title: "OnikArt — цифровые системы для бизнеса",
    description: "Дизайн, разработка, инфраструктура, интеграции и автоматизация — как единая система.",
    ...(origin ? { url: `${origin}/` } : {}),
    images: [{ url: origin ? `${origin}${sitePath("/images/og.png")}` : sitePath("/images/og.png") }],
  },
  icons: { icon: sitePath("/images/favicon.png") },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="ru"><head><link rel="preload" href={sitePath("/fonts/mazzard/MazzardH-ExtraBold.woff2")} as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href={sitePath("/fonts/geologica/Geologica-Variable.ttf")} as="font" type="font/ttf" crossOrigin="anonymous"/></head><body>{children}</body></html>;
}
