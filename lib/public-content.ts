import { publicSnapshot } from "@/data/public-snapshot";
import { isPagesBuild } from "@/lib/deploy-target";
export { getPublicSettings } from "@/lib/public-settings";

export type PublicProject = {
  title: string; slug: string; subtitle: string | null; short_description: string;
  status: string; published: boolean; featured: boolean; service_tags: string;
  cover: string | null; seo_title: string | null; seo_description: string | null;
};
export type PublicService = { id: string; number: string; kicker: string; title: string; description: string; items: string };
export type PublicTariff = { id: string; name: string; eyebrow: string | null; description: string; price_mode: string; price_from: number | null; features: string; cta: string };
export type PublicBlock = { id: string; data: string };

export async function getPublicServices(): Promise<PublicService[]> {
  if (isPagesBuild) return publicSnapshot.services;
  const { all } = await import("@/lib/platform");
  return all<PublicService>("SELECT id,number,kicker,title,description,items FROM services WHERE is_visible=true ORDER BY sort_order");
}
export async function getPublicTariffs(): Promise<PublicTariff[]> {
  if (isPagesBuild) return publicSnapshot.tariffs;
  const { all } = await import("@/lib/platform");
  return all<PublicTariff>("SELECT id,name,eyebrow,description,price_mode,price_from,features,cta FROM tariffs WHERE is_visible=1 ORDER BY sort_order");
}
export async function getPublicFeaturedProject(): Promise<PublicProject | null> {
  if (isPagesBuild) return publicSnapshot.projects.find(project => project.published && project.featured) ?? null;
  const { one } = await import("@/lib/platform");
  return one<PublicProject>("SELECT title,slug,subtitle,short_description,status,published,featured,service_tags,cover,seo_title,seo_description FROM projects WHERE published=true AND featured=true ORDER BY featured_order LIMIT 1");
}
export async function getPublicProjectBySlug(slug: string): Promise<PublicProject | null> {
  if (isPagesBuild) return publicSnapshot.projects.find(project => project.slug === slug && project.published) ?? null;
  const { one } = await import("@/lib/platform");
  return one<PublicProject>("SELECT title,slug,subtitle,short_description,status,published,featured,service_tags,cover,seo_title,seo_description FROM projects WHERE slug=?", slug);
}
export async function getPublicProjectBlocks(slug: string): Promise<PublicBlock[]> {
  if (isPagesBuild) return slug === "fasadof" ? publicSnapshot.projectBlocks.fasadof : [];
  const { all } = await import("@/lib/platform");
  return all<PublicBlock>("SELECT id,data FROM project_blocks WHERE project_id=(SELECT id FROM projects WHERE slug=?) AND type='SYSTEM_ITEM' AND visible=true ORDER BY sort_order", slug);
}
export function getStaticPublicSlugs(): string[] {
  return publicSnapshot.projects.filter(project => project.published).map(project => project.slug);
}
