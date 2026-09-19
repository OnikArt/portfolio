"use client";

import { useId, useState } from "react";

export type SystemItem = { id: string; number: string; title: string; shortText?: string; detailText: string };

export function SystemAccordion({ items }: { items: SystemItem[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<string | null>(null);
  return <div className="system-rows">{items.map((item) => {
    const expanded = open === item.id;
    const panelId = `${baseId}-${item.id.replace(/[^a-z0-9_-]/gi, "-")}`;
    return <article className={`system-row${expanded ? " is-open" : ""}`} key={item.id}>
      <span>{item.number}</span><h3>{item.title}</h3>{item.shortText && <p>{item.shortText}</p>}
      <button type="button" aria-expanded={expanded} aria-controls={panelId} aria-label={`${expanded ? "Свернуть" : "Подробнее"}: ${item.title}`} onClick={() => setOpen(expanded ? null : item.id)}><i aria-hidden="true">↗</i></button>
      <div className="system-row__detail" id={panelId} hidden={!expanded}><p>{item.detailText}</p></div>
    </article>;
  })}</div>;
}
