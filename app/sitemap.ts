import type { MetadataRoute } from "next";
const publicUrl=process.env.NEXT_PUBLIC_SITE_URL;
if(process.env.NODE_ENV==="production"&&!publicUrl)throw new Error("NEXT_PUBLIC_SITE_URL is required for production sitemap");
const origin = (publicUrl || "http://localhost:3000").replace(/\/$/, "");
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: `${origin}/`, priority: 1 }, { url: `${origin}/work/fasadof`, priority: .8 }]; }
