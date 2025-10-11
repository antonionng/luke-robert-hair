'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/salon', label: 'Salon' },
  { href: '/education', label: 'Education' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-offwhite/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-20 px-6 md:px-12 lg:px-24">
          {/* Logo */}
          <Link href="/" className="flex items-center -ml-1">
            <div className="relative w-24 h-10">
              <Image
                src="/images/logo.svg"
                alt="Luke Robert Hair"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide hover:text-sage transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/book" className="px-6 py-2 bg-sage text-white rounded-full text-sm font-medium hover:bg-sage-dark transition-all hover:scale-105">
              Book Now
            </Link>
            <Link href="/admin" className="p-2 hover:bg-sage/10 rounded-lg transition-colors" title="CRM Login">
              <LogIn size={20} className="text-sage" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-sage/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-offwhite border-t border-mist"
          >
            <div className="container-custom px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium hover:text-sage transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                className="w-full text-center px-8 py-4 bg-sage text-white rounded-full font-medium hover:bg-sage/90 transition-colors"
              >
                Book Now
              </Link>
              <Link
                href="/admin"
                className="w-full text-center px-8 py-4 border-2 border-sage text-sage rounded-full font-medium hover:bg-sage hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                CRM Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
