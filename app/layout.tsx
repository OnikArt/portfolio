import type { Metadata } from "next";
import "./globals.css";

const publicUrl=process.env.NEXT_PUBLIC_SITE_URL;
if(process.env.NODE_ENV==="production"&&!publicUrl)throw new Error("NEXT_PUBLIC_SITE_URL is required for production metadata");

export const metadata: Metadata = {
  metadataBase: new URL(publicUrl || "http://localhost:3000"),
  title: "OnikArt — цифровые системы для бизнеса",
  description: "Создание сайтов и цифровой инфраструктуры для бизнеса: дизайн, разработка, админ-панели, аналитика, интеграции и автоматизация.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "OnikArt — цифровые системы для бизнеса",
    description: "Дизайн, разработка, инфраструктура, интеграции и автоматизация — как единая система.",
    url: "/",
    siteName: "OnikArt",
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/images/og.png", width: 1200, height: 630, alt: "ONIKART. Цифровые системы для бизнеса." }],
  },
  twitter: { card: "summary_large_image", title: "OnikArt — цифровые системы для бизнеса", description: "Дизайн, разработка, инфраструктура, интеграции и автоматизация.", images: ["/images/og.png"] },
  icons: { icon: "/images/favicon.png", shortcut: "/images/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preload" href="/fonts/mazzard/MazzardH-ExtraBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/geologica/Geologica-Variable.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
