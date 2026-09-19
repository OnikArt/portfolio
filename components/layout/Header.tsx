"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  ["Работы", "#work"],
  ["Услуги", "#services"],
  ["Форматы работы", "#work-formats"],
  ["Подход", "#process"],
  ["Обо мне", "#about"],
] as const;

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
    document.body.classList.toggle("menu-is-open", open);
    if (!open) return () => document.body.classList.remove("menu-is-open");
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPopState = () => setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.body.style.overflow = previous;
      document.body.classList.remove("menu-is-open");
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", onPopState);
    };
  }, [open]);

  const close = () => setOpen(false);
  const closeAndFocus = () => {
    setOpen(false);
    requestAnimationFrame(() => toggleRef.current?.focus());
  };
  return (
    <header
      className={`header${scrolled ? " header--scrolled" : ""}${open ? " header--menu" : ""}`}
    >
      <div className="container header__inner">
        <a className="wordmark" href="/" aria-label="OnikArt — на главную">
          ONIKART
        </a>
        <nav className="nav" aria-label="Основная навигация">
          {links.map(([label, href]) => (
            <a href={`${anchorPrefix}${href}`} key={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header__cta" href={`${anchorPrefix}#contact`}>
          Обсудить проект <span aria-hidden="true">↗</span>
        </a>
        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
        <nav
          id="mobile-menu"
          className="mobile-nav"
          aria-label="Мобильная навигация"
          aria-hidden={!open}
        >
          <button
            className="mobile-nav__close"
            type="button"
            aria-label="Закрыть меню"
            onClick={closeAndFocus}
            tabIndex={open ? 0 : -1}
          >
            <span />
            <span />
          </button>
          <div className="mobile-nav__links">
            {links.map(([label, href], index) => (
              <a
                ref={index === 0 ? firstLinkRef : undefined}
                href={`${anchorPrefix}${href}`}
                onClick={close}
                key={href}
                tabIndex={open ? 0 : -1}
              >
                {label}
              </a>
            ))}
          </div>
          <a
            className="mobile-nav__cta"
            href={`${anchorPrefix}#contact`}
            onClick={close}
            tabIndex={open ? 0 : -1}
          >
            Обсудить проект <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
