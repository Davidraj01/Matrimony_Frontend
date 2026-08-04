import { useMemo } from "react";
import { motion } from "framer-motion";

// ---- icons (small, hand-drawn shapes — no external assets) ----

const FlowerIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <circle cx="12" cy="2" r="2" fill="currentColor" />
    <circle cx="22" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="22" r="2" fill="currentColor" />
    <circle cx="2" cy="12" r="2" fill="currentColor" />
    <circle cx="18" cy="6" r="2" fill="currentColor" />
    <circle cx="18" cy="18" r="2" fill="currentColor" />
    <circle cx="6" cy="18" r="2" fill="currentColor" />
    <circle cx="6" cy="6" r="2" fill="currentColor" />
  </svg>
);

const HeartIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SparkleIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const PetalIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C7 6 4 11 8 17c2 3 6 4 8 2s1-6-2-8C11 8 12 4 12 2z" />
  </svg>
);

const StarIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 3l1.6 4.9L19 9l-4 3.3L16.5 18 12 15l-4.5 3L9 12.3 5 9l5.4-1.1L12 3z" />
  </svg>
);

// A rose bloom — three overlapping petal ellipses rotated into a rosette,
// with a short stem and leaf.
const RoseIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path
      d="M12 15c0 3-1 5.2-3.2 7"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
      opacity="0.85"
    />
    <path
      d="M9.6 17.3c-1.4-.3-2.5.3-3 1.5 1.3.5 2.6.2 3.3-.9"
      fill="currentColor"
      opacity="0.85"
    />
    <g opacity="0.95">
      <ellipse cx="12" cy="8.5" rx="4.3" ry="3" transform="rotate(0 12 8.5)" />
      <ellipse cx="12" cy="8.5" rx="4.3" ry="3" transform="rotate(60 12 8.5)" />
      <ellipse cx="12" cy="8.5" rx="4.3" ry="3" transform="rotate(120 12 8.5)" />
    </g>
    <circle cx="12" cy="8.5" r="1.8" opacity="0.6" />
  </svg>
);

// A radiating spark/cracker burst — used for the periodic firework flashes.
const FireworkIcon = ({ className, style, spokes = 10 }) => {
  const lines = Array.from({ length: spokes }, (_, i) => {
    const rad = ((i * 360) / spokes) * (Math.PI / 180);
    return (
      <line
        key={i}
        x1="12"
        y1="12"
        x2={12 + 9.5 * Math.cos(rad)}
        y2={12 + 9.5 * Math.sin(rad)}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    );
  });
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      {lines}
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
};

// A decorative bride-and-groom silhouette — veil, gown, bouquet, bowtie
// and a small connecting heart. A corner watermark, not a literal photo.
const CoupleIcon = ({ className }) => (
  <svg viewBox="0 0 140 110" fill="currentColor" className={className}>
    {/* soft ground shadow */}
    <ellipse cx="70" cy="104" rx="58" ry="4" opacity="0.15" />

    {/* bride */}
    <ellipse cx="45" cy="16" rx="14" ry="16" opacity="0.3" />
    <circle cx="45" cy="9" r="3" opacity="0.6" />
    <circle cx="45" cy="17" r="8" />
    <path d="M37,26 Q45,32 53,26 L50,46 Q68,70 70,100 L20,100 Q22,70 40,46 Z" />
    <circle cx="56" cy="71" r="3" opacity="0.8" />
    <circle cx="59" cy="74" r="2.4" opacity="0.7" />
    <circle cx="55" cy="75" r="2.2" opacity="0.7" />

    {/* connecting heart */}
    <path
      d="M70 84c-3-3-7-2-7 2 0 3 3 5 7 8 4-3 7-5 7-8 0-4-4-5-7-2z"
      opacity="0.9"
    />

    {/* groom */}
    <circle cx="95" cy="17" r="8" />
    <path d="M85,26 L105,26 L112,100 L78,100 Z" />
    <path d="M91,25 L95,28 L91,31 Z" opacity="0.85" />
    <path d="M99,25 L95,28 L99,31 Z" opacity="0.85" />
  </svg>
);

const FLOAT_ICONS = {
  flower: FlowerIcon,
  heart: HeartIcon,
  sparkle: SparkleIcon,
  rose: RoseIcon,
};
const FLOAT_COLOR = {
  flower: "text-pink-500",
  heart: "text-red-500",
  sparkle: "text-yellow-400",
  rose: "text-rose-600",
};

// Deterministic pseudo-random so positions don't reshuffle on re-render.
const seeded = (i, salt = 1) => {
  const x = Math.sin(i * 12.9898 * salt) * 43758.5453;
  return x - Math.floor(x);
};

const COUNTS = {
  light: { rising: 4, petals: 5, stars: 6, garland: 9, lights: 10 },
  normal: { rising: 6, petals: 9, stars: 12, garland: 15, lights: 18 },
  rich: { rising: 10, petals: 15, stars: 20, garland: 20, lights: 26 },
};

export default function WeddingBackground({ density = "normal" }) {
  const light = density === "light";

  // Pure derived data from `density` — no external system to synchronize
  // with, so this is a memo rather than state-set-in-an-effect.
  const { rising, petals, stars, garland, lights, corners, fireworks } = useMemo(() => {
    const n = COUNTS[density] || COUNTS.normal;
    const isLight = density === "light";
    const types = ["flower", "heart", "sparkle", "rose"];

    const rising = Array.from({ length: n.rising }, (_, i) => ({
      id: i,
      type: types[i % types.length],
      duration: 5 + seeded(i, 2) * 3,
      delay: seeded(i, 3) * 3,
      startX: seeded(i, 5) * 100,
      size: 26 + seeded(i, 7) * 24,
      opacity: 0.55 + seeded(i, 9) * 0.4,
    }));

    const petals = Array.from({ length: n.petals }, (_, i) => ({
      id: i,
      duration: 8 + seeded(i, 11) * 6,
      delay: seeded(i, 13) * 6,
      startX: seeded(i, 17) * 100,
      drift: (seeded(i, 19) - 0.5) * 120,
      size: 20 + seeded(i, 23) * 20,
      rotate: 180 + seeded(i, 29) * 360,
      color: seeded(i, 31) > 0.5 ? "text-pink-400" : "text-rose-400",
    }));

    const stars = Array.from({ length: n.stars }, (_, i) => ({
      id: i,
      top: seeded(i, 37) * 55,
      left: seeded(i, 41) * 100,
      size: 13 + seeded(i, 43) * 15,
      duration: 2 + seeded(i, 47) * 2.5,
      delay: seeded(i, 53) * 3,
    }));

    const gCount = n.garland;
    const garland = Array.from({ length: gCount }, (_, i) => ({
      id: i,
      left: (i / (gCount - 1)) * 100,
      drop: Math.sin((i / (gCount - 1)) * Math.PI) * 22,
      marigold: i % 2 === 0,
    }));

    const lCount = n.lights;
    const lights = Array.from({ length: lCount }, (_, i) => ({
      id: i,
      left: (i / (lCount - 1)) * 100,
      drop: Math.sin((i / (lCount - 1)) * Math.PI) * 14 + 6,
      delay: seeded(i, 59) * 2.4,
    }));

    // small flower/rose clusters tucked into the other two corners
    const corners = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      offset: seeded(i, 61) * 26,
      size: 17 + seeded(i, 67) * 15,
      kind: i % 3, // 0 marigold, 1 pink flower, 2 rose
      duration: 4 + seeded(i, 71) * 3,
    }));

    const fireworks = Array.from({ length: isLight ? 3 : 6 }, (_, i) => ({
      id: i,
      top: 8 + seeded(i, 73) * 72,
      side: i % 2 === 0 ? "left" : "right",
      inset: 4 + seeded(i, 79) * 10,
      color: ["text-amber-400", "text-pink-500", "text-rose-500", "text-yellow-400"][i % 4],
      delay: i * 0.5,
      repeatDelay: 1.5 + seeded(i, 89) * 1.5,
    }));

    return { rising, petals, stars, garland, lights, corners, fireworks };
  }, [density]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* AMBIENT GLOW — soft candlelight behind everything */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "60vmax",
          height: "60vmax",
          background:
            "radial-gradient(circle, rgba(251,191,36,0.16) 0%, rgba(244,63,94,0.08) 45%, transparent 72%)",
          filter: "blur(12px)",
        }}
      />

      {/* BOTTOM-LEFT flower + rose cluster */}
      <div className="absolute bottom-2 left-2">
        {corners.map((c) => {
          const color =
            c.kind === 0 ? "text-amber-400" : c.kind === 1 ? "text-pink-400" : "text-rose-500";
          const Icon = c.kind === 2 ? RoseIcon : FlowerIcon;
          return (
            <div
              key={c.id}
              className={`absolute ${color}`}
              style={{
                left: c.offset,
                bottom: c.offset * 0.6,
                width: c.size,
                height: c.size,
                animation: `wb-corner-sway ${c.duration}s infinite ease-in-out`,
              }}
            >
              <Icon className="w-full h-full" />
            </div>
          );
        })}
      </div>

      {/* FIRECRACKER BURSTS — periodic radiating flashes down the side margins */}
      {fireworks.map((f) => (
        <motion.div
          key={f.id}
          className={`absolute ${f.color}`}
          style={{
            top: `${f.top}%`,
            [f.side]: `${f.inset}%`,
            width: 54,
            height: 54,
          }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.1, 1.4, 1.6] }}
          transition={{
            duration: 1.1,
            delay: f.delay,
            repeat: Infinity,
            repeatDelay: f.repeatDelay,
            ease: "easeOut",
          }}
        >
          <FireworkIcon className="w-full h-full" style={{ filter: "drop-shadow(0 0 9px currentColor)" }} />
        </motion.div>
      ))}

      {/* TOP-RIGHT sparkle burst */}
      <div className="absolute top-3 right-3">
        {corners.slice(0, 4).map((c) => (
          <div
            key={c.id}
            className="absolute text-yellow-300"
            style={{
              right: c.offset,
              top: c.offset * 0.5,
              width: c.size * 0.8,
              height: c.size * 0.8,
              animation: `wb-sparkle-twinkle ${2.5 + (c.id % 2)}s infinite ease-in-out`,
            }}
          >
            <SparkleIcon className="w-full h-full" />
          </div>
        ))}
      </div>

      {/* STRING LIGHTS along the top edge */}
      <div className="absolute top-0 left-0 right-0 h-16">
        {lights.map((l) => (
          <span
            key={l.id}
            className="absolute rounded-full bg-amber-300"
            style={{
              left: `${l.left}%`,
              top: `${l.drop}px`,
              width: 9,
              height: 9,
              boxShadow: "0 0 10px 3px rgba(252,211,77,0.9)",
              animation: `wb-light-twinkle 2.2s ${l.delay}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* MARIGOLD / FLOWER GARLAND just below the lights */}
      <div className="absolute top-0 left-0 right-0 h-24">
        {garland.map((g) => (
          <div
            key={g.id}
            className={g.marigold ? "absolute text-amber-400" : "absolute text-pink-400"}
            style={{
              left: `${g.left}%`,
              top: `${g.drop + 14}px`,
              width: 16,
              height: 16,
              animation: `wb-garland-sway ${5 + (g.id % 3)}s infinite ease-in-out`,
            }}
          >
            <FlowerIcon className="w-full h-full" />
          </div>
        ))}
      </div>

      {/* TWINKLING STARS */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute text-indigo-500"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animation: `wb-star-twinkle ${s.duration}s ${s.delay}s infinite ease-in-out`,
          }}
        >
          <StarIcon className="w-full h-full" />
        </div>
      ))}

      {/* FALLING PETALS */}
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute ${p.color}`}
          style={{ left: `${p.startX}%`, width: p.size, height: p.size }}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{
            y: (typeof window !== "undefined" ? window.innerHeight : 800) + 40,
            x: p.drift,
            opacity: [0, 1, 1, 0],
            rotate: p.rotate,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <PetalIcon className="w-full h-full" />
        </motion.div>
      ))}

      {/* RISING FLOWERS / HEARTS / SPARKLES */}
      {rising.map((el) => {
        const Icon = FLOAT_ICONS[el.type];
        return (
          <motion.div
            key={el.id}
            className={`absolute ${FLOAT_COLOR[el.type]}`}
            style={{ left: `${el.startX}%`, width: el.size, height: el.size }}
            initial={{
              y: typeof window !== "undefined" ? window.innerHeight : 800,
              opacity: el.opacity,
            }}
            animate={{ y: -100, opacity: 0, x: Math.sin(el.id) * 50 }}
            transition={{
              duration: el.duration,
              delay: el.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Icon className="w-full h-full" style={{ filter: "drop-shadow(0 0 8px rgba(244,63,94,0.45))" }} />
          </motion.div>
        );
      })}

      {/* COUPLE WATERMARK — decorative corner accent */}
      <div
        className="absolute bottom-0 right-0 text-rose-400 opacity-[0.34]"
        style={{
          width: light ? 130 : 170,
          height: light ? 102 : 134,
          animation: "wb-bob 6s infinite ease-in-out",
        }}
      >
        <CoupleIcon className="w-full h-full" />
      </div>

      {/* LARGE ROSE ACCENT — always visible, clear of the corner photo frames */}
      <div
        className="absolute text-rose-600 opacity-90"
        style={{
          top: "63%",
          left: "1%",
          width: light ? 72 : 100,
          height: light ? 72 : 100,
          animation: "wb-rose-sway 5s infinite ease-in-out",
        }}
      >
        <RoseIcon className="w-full h-full" style={{ filter: "drop-shadow(0 2px 6px rgba(190,18,60,0.55))" }} />
      </div>
    </div>
  );
}
