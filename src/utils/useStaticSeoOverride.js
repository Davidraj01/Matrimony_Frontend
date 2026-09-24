import { useEffect } from "react";

// index.html ships default description/Open Graph/Twitter tags for crawlers
// that don't run JavaScript. react-helmet-async on React 19 adds its own tags
// next to them instead of replacing them, leaving two conflicting copies.
// Pages that set their own SEO tags call this to hide the defaults while they
// are mounted, then put them back so the next page falls back to them.
export default function useStaticSeoOverride() {
  useEffect(() => {
    const nodes = [...document.head.querySelectorAll("[data-static-seo]")];
    nodes.forEach((n) => n.remove());
    return () => nodes.forEach((n) => document.head.appendChild(n));
  }, []);
}
