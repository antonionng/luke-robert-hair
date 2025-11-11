'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X } from 'lucide-react';
import Link from 'next/link';

export default function FloatingReferralButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap"
          >
            <div className="bg-white rounded-xl shadow-2xl px-4 py-3 border-2 border-purple-200">
              <p className="text-sm font-medium text-graphite">
                🎁 Refer a friend, get £10 off!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 1 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative"
      >
        {/* Dismiss button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-graphite text-white rounded-full flex items-center justify-center hover:bg-graphite/80 transition-all z-10"
        >
          <X size={14} />
        </button>

        {/* Main button */}
        <Link
          href="/referrals"
          className="block w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-110 flex items-center justify-center relative overflow-hidden"
        >
          {/* Pulse animation */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1.5, 1],
              opacity: [0.7, 0, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"
          />

          {/* Icon */}
          <Gift size={28} className="text-white relative z-10" />

          {/* Badge */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white"
          >
            10
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}

