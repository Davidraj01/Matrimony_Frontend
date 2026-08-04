import weddingHero from "../assets/wedding-hero.jpg";

// A large, softly vignetted photo used purely as ambient decoration —
// full opacity in the middle, fading to nothing at the far edges, so it
// never competes with text (or other decorative layers) sitting on top.
export default function CoupleBackdrop({ image = weddingHero, opacity = 0.55 }) {
  const vignette =
    "radial-gradient(ellipse 80% 75% at 50% 38%, black 65%, transparent 99%)";

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        opacity,
        maskImage: vignette,
        WebkitMaskImage: vignette,
      }}
    />
  );
}
