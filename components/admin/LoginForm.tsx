"use client";
import { FormEvent, useState } from "react";

export function LoginForm({ returnTo = "/admin" }: { returnTo?: string }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) { setError(data.error || "Не удалось войти."); return; }
      location.assign(returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/admin");
    } catch { setError("Сервер недоступен. Попробуйте ещё раз."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit}><label>Email<input name="email" type="email" required autoComplete="username" /></label><label>Пароль<input name="password" type="password" required autoComplete="current-password" /></label><button className="button button--primary" disabled={busy}>{busy ? "Проверяю…" : "Войти"}</button>{error && <p role="alert">{error}</p>}</form>;
}
