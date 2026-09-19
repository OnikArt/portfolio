"use client";
import { FormEvent, useState } from "react";
import { siteSettings } from "@/data/site";
import { ContactLink } from "@/components/ui/ContactLink";

function normalizePhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith("7")) digits = `7${digits}`;
  return `+${digits.slice(0, 11)}`;
}
function formatPhone(value: string) {
  const digits = normalizePhone(value).slice(2);
  let result = "+7";
  if (digits.length) result += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) result += ")";
  if (digits.length > 3) result += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) result += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) result += `-${digits.slice(8, 10)}`;
  return result;
}

export function Contact() {
  const [notice, setNotice] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const normalized = normalizePhone(String(data.get("phone") || ""));
    if (!/^\+7\d{10}$/.test(normalized)) {
      setPhoneError("Введите номер телефона полностью.");
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setPhoneError("");
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: normalized,
          message: data.get("message"),
          page: location.pathname,
          source: "website",
          utm: location.search,
        }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(body.error || "Не удалось отправить заявку.");
      setNotice("Заявка сохранена. Я свяжусь с вами.");
      form.reset();
      setPhone("");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Не удалось отправить заявку.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="contact" id="contact">
      <div className="container contact__grid">
        <div>
          <p className="section-label section-label--dark">ЕСТЬ ЗАДАЧА?</p>
          <h2>
            <span>ДАВАЙТЕ ОБСУДИМ</span>
            <span>ВАШ ПРОЕКТ.</span>
          </h2>
          <p className="contact__copy">
            {[...siteSettings.contacts, ...siteSettings.socialLinks].map(
              (item) => (
                <span key={item.label}>
                  <ContactLink item={item}/>
                  <br />
                </span>
              ),
            )}
          </p>
        </div>
        <form className="contact-form" onSubmit={submit} noValidate>
          <label>
            Имя *
            <input required minLength={2} name="name" autoComplete="name" />
          </label>
          <label>
            Номер телефона *
            <input
              required
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 (___) ___-__-__"
              value={phone}
              onChange={(event) => {
                setPhone(formatPhone(event.currentTarget.value));
                if (phoneError) setPhoneError("");
              }}
              aria-invalid={Boolean(phoneError)}
              aria-describedby={phoneError ? "phone-error" : undefined}
            />
            {phoneError && (
              <span id="phone-error" role="alert">
                {phoneError}
              </span>
            )}
          </label>
          <label>
            Расскажите о задаче
            <textarea name="message" rows={4} maxLength={3000} />
          </label>
          <label className="consent">
            <input type="checkbox" required /> Согласен на обработку данных по{" "}
            <a href="/privacy">политике конфиденциальности</a>.
          </label>
          <button disabled={busy}>
            {busy ? "Отправляем…" : "Отправить"} <span>↗</span>
          </button>
          {notice && (
            <p className="form-notice" role="status">
              {notice}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
