import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedCard Component - Adds wedding-themed interactive animations to cards
 * Features: Hover scale, heart particles on hover, glow effect
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.showHearts - Show heart particles on hover (default: true)
 */
export const AnimatedCard = ({
  children,
  className = '',
  onClick,
  showHearts = true,
}) => {
  const [showParticles, setShowParticles] = React.useState(false);

  const handleHoverStart = () => {
    if (showHearts) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 600);
    }
  };

  const HeartParticle = ({ index }) => (
    <motion.div
      className="absolute text-red-400 pointer-events-none"
      initial={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      animate={{
        opacity: 0,
        x: (Math.random() - 0.5) * 100,
        y: -50 - Math.random() * 100,
        scale: 0,
      }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </motion.div>
  );

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{
        scale: 1.05,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={handleHoverStart}
      onClick={onClick}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-400 to-red-400 opacity-0 blur-xl"
        whileHover={{
          opacity: 0.2,
        }}
      />

      {/* Main card content */}
      <div className="relative z-10">{children}</div>

      {/* Heart particles */}
      {showParticles &&
        Array.from({ length: 3 }).map((_, i) => (
          <HeartParticle key={i} index={i} />
        ))}
    </motion.div>
  );
};

/**
 * AnimatedButton Component - Interactive wedding-themed button
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'outline')
 */
export const AnimatedButton = ({
  children,
  className = '',
  onClick,
  variant = 'primary',
  ...props
}) => {
  const baseClass =
    'px-6 py-2 rounded-lg font-semibold transition-all duration-200 relative overflow-hidden';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-500 to-red-500 text-white',
    secondary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    outline: 'border-2 border-pink-500 text-pink-500',
  };

  return (
    <motion.button
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 10px 25px rgba(236, 72, 153, 0.4)',
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>

      {/* Animated background shine */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        initial={{ x: '-100%' }}
        whileHover={{
          x: '100%',
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 0.6,
        }}
      />
    </motion.button>
  );
};

/**
 * AnimatedInput Component - Input field with animation
 * @param {Object} props - Component props
 * @param {string} props.placeholder - Input placeholder
 * @param {Function} props.onChange - Change handler
 * @param {string} props.value - Input value
 * @param {React.ReactNode} props.icon - Left icon
 * @param {string} props.className - Additional CSS classes
 */
export const AnimatedInput = ({
  placeholder = '',
  onChange,
  value,
  icon,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <motion.div
      className="relative"
      whileFocus="focused"
      initial="initial"
      animate={isFocused ? 'focused' : 'initial'}
      variants={{
        initial: { scale: 1 },
        focused: { scale: 1.02 },
      }}
    >
      {icon && (
        <motion.div
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          variants={{
            initial: { scale: 1, color: '#9ca3af' },
            focused: { scale: 1.2, color: '#ec4899' },
          }}
        >
          {icon}
        </motion.div>
      )}

      <motion.input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`pl-10 w-full border-2 border-gray-300 rounded-lg p-2.5 focus:border-pink-500 outline-none transition-colors ${className}`}
        variants={{
          initial: { borderColor: '#d1d5db' },
          focused: { borderColor: '#ec4899' },
        }}
        {...props}
      />

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-red-400"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{
          scaleX: isFocused ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
        }}
      />
    </motion.div>
  );
};

export default {
  AnimatedCard,
  AnimatedButton,
  AnimatedInput,
};
