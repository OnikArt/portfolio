import { redirect } from "next/navigation";
import { readAdmin } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function Login({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  if (await readAdmin()) redirect("/admin");
  const requested = (await searchParams).returnTo ?? "/admin";
  const returnTo = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/admin";
  return <main className="admin-login"><div><p className="admin-logo">ONIKART.</p><span>ADMIN SYSTEM</span><h1>Вход в систему</h1><LoginForm returnTo={returnTo} /><a href="/">← Вернуться на главную</a></div></main>;
}
