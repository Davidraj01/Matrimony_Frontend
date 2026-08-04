import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * ConfettiCelebration Component - Wedding-themed celebration animation
 * Perfect for successful registrations, matches, and special moments
 */
const ConfettiCelebration = ({ isVisible = true, onComplete }) => {
  useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1.5,
    x: (Math.random() - 0.5) * 400,
    rotation: Math.random() * 360,
    emoji: ['💕', '🌸', '💐', '🎉', '✨', '🌺', '💍'][
      Math.floor(Math.random() * 7)
    ],
  }));

  const ConfettiPiece = ({ piece }) => (
    <motion.div
      key={piece.id}
      className="fixed pointer-events-none text-4xl"
      initial={{
        y: -50,
        x: 0,
        opacity: 1,
        rotate: 0,
      }}
      animate={{
        y: typeof window !== 'undefined' ? window.innerHeight + 100 : 800,
        x: piece.x,
        opacity: 0,
        rotate: piece.rotation,
      }}
      transition={{
        duration: piece.duration,
        delay: piece.delay,
        ease: 'easeIn',
      }}
      style={{
        left: '50%',
        top: '0',
        transform: 'translateX(-50%)',
      }}
    >
      {piece.emoji}
    </motion.div>
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Center burst animation */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="w-40 h-40 rounded-full bg-gradient-to-r from-pink-400 via-red-400 to-purple-400 blur-3xl" />
      </motion.div>

      {/* Ring pulse animation */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-pink-400 rounded-full"
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 300, height: 300, opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* Confetti pieces */}
      {confettiPieces.map((piece) => (
        <ConfettiPiece key={piece.id} piece={piece} />
      ))}

      {/* Text overlay */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 mb-2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.6 }}
        >
          Congratulations! 🎉
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Welcome to your journey
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ConfettiCelebration;
