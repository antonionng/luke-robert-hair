'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingBookButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Link
            href="/book"
            className="flex items-center gap-2 px-6 py-4 bg-sage text-white rounded-full font-medium shadow-lg hover:bg-sage-dark hover:shadow-xl transition-all hover:scale-105"
          >
            <Calendar size={20} />
            <span className="hidden sm:inline">Book Now</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
