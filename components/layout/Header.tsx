"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [["Работы", "#work"], ["Услуги", "#services"], ["Подход", "#process"], ["Обо мне", "#about"]] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const anchorPrefix = pathname === "/" ? "" : "/";
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKeyDown); };
  }, [open]);

  const close = () => setOpen(false);
  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}${open ? " header--menu" : ""}`}>
      <div className="container header__inner">
        <Link className="wordmark" href="/" aria-label="OnikArt — на главную">ONIKART</Link>
        <nav className="nav" aria-label="Основная навигация">
          {links.map(([label, href]) => <a href={`${anchorPrefix}${href}`} key={href}>{label}</a>)}
        </nav>
        <a className="header__cta" href={`${anchorPrefix}#contact`}>Обсудить проект <span aria-hidden="true">↗</span></a>
        <button ref={toggleRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Закрыть меню" : "Открыть меню"} onClick={() => setOpen((value) => !value)}><span /><span /></button>
        <nav id="mobile-menu" className="mobile-nav" aria-label="Мобильная навигация" aria-hidden={!open}>
          <div className="mobile-nav__links">
            {links.map(([label, href], index) => <a ref={index === 0 ? firstLinkRef : undefined} href={`${anchorPrefix}${href}`} onClick={close} key={href} tabIndex={open ? 0 : -1}>{label}</a>)}
          </div>
          <a className="mobile-nav__cta" href={`${anchorPrefix}#contact`} onClick={close} tabIndex={open ? 0 : -1}>Обсудить проект <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  );
}
