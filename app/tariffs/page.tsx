import { Header } from "@/components/layout/Header";import { Footer } from "@/components/layout/Footer";import { Pricing } from "@/components/sections/Pricing";
export const dynamic = "force-dynamic";
export default function Tariffs(){return <><Header/><main style={{paddingTop:'var(--header-height)'}}><Pricing/></main><Footer/></>}
