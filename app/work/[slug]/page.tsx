import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { can, readAdmin } from "@/lib/admin-auth";
import { getPublicProjectBySlug } from "@/lib/public-content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> };

async function visibleProject(slug: string, preview?: string) {
  const project = await getPublicProjectBySlug(slug);
  if (!project) notFound();
  if (!project.published) {
    const admin = preview === "1" ? await readAdmin() : null;
    if (!admin || !can(admin, "works.view")) notFound();
  }
  return project;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  const project = await visibleProject(slug, preview);
  const title = project.seo_title || `${project.title} — кейс OnikArt`;
  const description = project.seo_description || project.short_description;
  return {
    title,
    description,
    robots: !project.published || preview === "1" ? { index: false, follow: false } : undefined,
    alternates: { canonical: `/work/${encodeURIComponent(slug)}/` },
    openGraph: { title, description, url: `/work/${encodeURIComponent(slug)}/`, images: project.cover ? [{ url: project.cover }] : undefined },
  };
}

export default async function Work({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const project = await visibleProject(slug, preview);
  const tags = JSON.parse(project.service_tags) as string[];
  return <><Header/><main className="case-page"><section className="case-hero"><div className="container"><p className="section-label">CASE / SELECTED WORK</p><h1>{project.title}</h1><p>{project.subtitle||project.short_description}</p><p className="project-status"><i/>{project.status==='IN_PROGRESS'?'В работе':'Завершено'}</p></div></section><section className="section case-narrative"><div className="container"><article><span>01</span><h2>ЗАДАЧА</h2><p>{project.short_description}</p></article><article><span>02</span><h2>НАПРАВЛЕНИЯ</h2><p>{tags.join(' · ')||'Digital system'}</p></article></div></section></main><Footer/></>;
}
