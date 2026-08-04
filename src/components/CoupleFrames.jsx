import { motion } from "framer-motion";
import couple1 from "../assets/couple1-thumb.jpg";
import couple2 from "../assets/couple2-thumb.jpg";
import couple3 from "../assets/couple3-thumb.jpg";
import couple4 from "../assets/couple4-thumb.jpg";
import couple5 from "../assets/couple5-thumb.jpg";
import couple6 from "../assets/couple6-thumb.jpg";

// Scattered Polaroid-style photo frames for the auth pages, built from six
// real couple portraits in assets.
const FRAMES = [
  { id: 1, src: couple1, top: "7%", left: "4%", size: 138, rotate: -8, delay: 0 },
  { id: 2, src: couple4, top: "12%", right: "5%", size: 122, rotate: 7, delay: 0.35 },
  { id: 3, src: couple6, bottom: "11%", left: "5%", size: 130, rotate: 6, delay: 0.7 },
  { id: 4, src: couple5, bottom: "16%", right: "4%", size: 142, rotate: -6, delay: 1.05 },
  { id: 5, src: couple2, top: "44%", left: "1.5%", size: 100, rotate: 10, delay: 1.4 },
  { id: 6, src: couple3, top: "48%", right: "1.5%", size: 104, rotate: -10, delay: 1.75 },
];

export default function CoupleFrames() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {FRAMES.map((f) => (
        <motion.div
          key={f.id}
          className="absolute rounded-sm bg-white p-1.5 shadow-lg"
          style={{
            top: f.top,
            left: f.left,
            right: f.right,
            bottom: f.bottom,
            width: f.size,
            rotate: f.rotate,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85, y: [0, -8, 0] }}
          transition={{
            opacity: { duration: 0.6 },
            y: { duration: 6, delay: f.delay, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div
            className="w-full aspect-[4/5] rounded-[1px] bg-cover bg-top"
            style={{ backgroundImage: `url(${f.src})` }}
          />
        </motion.div>
      ))}
    </div>
  );
}
