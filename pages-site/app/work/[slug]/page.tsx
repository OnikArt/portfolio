import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FasadofCase from "@/app/work/fasadof/page";
import Work from "@/app/work/[slug]/page";
import { getPublicProjectBySlug, getStaticPublicSlugs } from "@/lib/public-content";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getStaticPublicSlugs().map(slug => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) notFound();
  const origin = process.env.PAGES_SITE_URL?.replace(/\/$/, "");
  const title = project.seo_title || `${project.title} — кейс OnikArt`;
  const description = project.seo_description || project.short_description;
  return {
    title,
    description,
    ...(origin ? { alternates: { canonical: `${origin}/work/${slug}/` } } : {}),
    openGraph: { title, description, ...(origin ? { url: `${origin}/work/${slug}/` } : {}) },
  };
}

export default async function StaticWork({ params }: Props) {
  const { slug } = await params;
  if (!await getPublicProjectBySlug(slug)) notFound();
  if (slug === "fasadof") return <FasadofCase searchParams={Promise.resolve({})}/>;
  return <Work params={params} searchParams={Promise.resolve({})}/>;
}
