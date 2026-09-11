"use client";

import { FormEvent, useState } from "react";
import { siteSettings } from "@/data/site";

type Errors = Partial<Record<"name" | "contact" | "message", string>>;

export function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: Errors = {};
    if (String(form.get("name") || "").trim().length < 2) next.name = "Укажите имя.";
    if (String(form.get("contact") || "").trim().length < 3) next.contact = "Укажите удобный способ связи.";
    if (String(form.get("message") || "").trim().length < 10) next.message = "Расскажите о задаче чуть подробнее.";
    setErrors(next);
    if (Object.keys(next).length) { setNotice(""); return; }
    if (!siteSettings.contactFormEnabled || !siteSettings.contactEndpoint) {
      setNotice("Форма пока не подключена к каналу получения заявок. Данные не были отправлены.");
      return;
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container contact__grid">
        <div>
          <p className="section-label section-label--dark">ЕСТЬ ЗАДАЧА?</p>
          <h2>ДАВАЙТЕ СОЗДАДИМ<br />ЧТО-ТО СИЛЬНОЕ.</h2>
          <p className="contact__copy">Расскажите о задаче. Я посмотрю на неё со стороны бизнеса, дизайна и разработки и предложу рациональный следующий шаг.</p>
        </div>
        <form className="contact-form" onSubmit={submit} noValidate>
          <label>Имя<input name="name" autoComplete="name" aria-describedby={errors.name ? "name-error" : undefined} aria-invalid={!!errors.name} />{errors.name && <span id="name-error">{errors.name}</span>}</label>
          <label>Как связаться<input name="contact" autoComplete="email" aria-describedby={errors.contact ? "contact-error" : undefined} aria-invalid={!!errors.contact} />{errors.contact && <span id="contact-error">{errors.contact}</span>}</label>
          <label>Расскажите о задаче<textarea name="message" rows={4} aria-describedby={errors.message ? "message-error" : undefined} aria-invalid={!!errors.message} />{errors.message && <span id="message-error">{errors.message}</span>}</label>
          <button type="submit">Отправить <span aria-hidden="true">↗</span></button>
          {notice && <p className="form-notice" role="status">{notice}</p>}
        </form>
      </div>
    </section>
  );
}
