"use client";

export function LogoutButton() {
  return <button onClick={async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) window.location.replace("/admin/login");
  }}>Выйти</button>;
}
