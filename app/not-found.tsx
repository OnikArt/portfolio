import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><span>404</span><h1>ЭТОЙ СТРАНИЦЫ<br />НЕТ В СИСТЕМЕ.</h1><Link href="/">На главную <i aria-hidden="true">↗</i></Link></main>;
}
