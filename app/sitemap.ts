import type { MetadataRoute } from "next";
const origin = "https://onikart.dwayneclifford50004.chatgpt.site";
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: `${origin}/`, priority: 1 }, { url: `${origin}/work/fasadof`, priority: .8 }]; }
