import { sitePath } from "@/lib/deploy-target";

export default function NotFound() {
  return <main className="not-found"><span>404</span><h1>ЭТОЙ СТРАНИЦЫ<br />НЕТ В СИСТЕМЕ.</h1><a href={sitePath("/")}>На главную <i aria-hidden="true">↗</i></a></main>;
}
