// Local fallback image (a light gray card with a heart glyph) as a data URI,
// so missing photos never depend on an external placeholder service being up
// (via.placeholder.com, used elsewhere in this app, is currently dead).
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#fdf2f8"/>
      <text x="50%" y="50%" font-family="sans-serif" font-size="48" fill="#f9a8d4" text-anchor="middle" dominant-baseline="middle">❤</text>
    </svg>
  `);
