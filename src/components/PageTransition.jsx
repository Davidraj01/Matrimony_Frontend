import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition Component - Smooth page fade-in animation
 * Provides elegant page transitions with subtle animations
 */
const PageTransition = ({ children }) => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
