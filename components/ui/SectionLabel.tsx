export function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={`section-label${dark ? " section-label--dark" : ""}`}>{children}</p>;
}
