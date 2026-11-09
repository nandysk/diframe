import { notFound } from "next/navigation";

// Any deeper address that isn't a real page shows the translated 404.
export default function CatchAll() {
  notFound();
}
