import DOMPurify from "dompurify";

// Blog bodies come from the TipTap editor in AdminBlogs (see
// src/components/admin/RichTextEditor.jsx), so this allowlist mirrors what
// that editor can actually produce — nothing else should ever render.
const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "u", "a",
  "h2", "h3", "h4", "ul", "ol", "li", "blockquote",
  "code", "pre", "hr",
];
const ALLOWED_ATTR = ["href", "target", "rel"];

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.hasAttribute("href")) {
    const href = node.getAttribute("href");
    // Neutralize anything that isn't a normal link — DOMPurify already
    // strips javascript: etc, this just keeps data:/other odd schemes out too.
    if (!/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
      node.removeAttribute("href");
      return;
    }
    if (/^https?:/i.test(href)) {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer nofollow ugc");
    }
  }
});

export function sanitizeBlogHtml(html) {
  return DOMPurify.sanitize(html || "", { ALLOWED_TAGS, ALLOWED_ATTR });
}

// Plain-text excerpt for meta descriptions and card previews — never
// rendered as HTML, so it doesn't need the allowlist above.
export function htmlToExcerpt(html, maxLength = 155) {
  const text = (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, "")}…`;
}
