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
  { href: '/cpd-partnerships', label: 'CPD Partnerships' },
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
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between h-20 px-6 md:px-8 lg:px-16">
          {/* Logo */}
          <Link href="/" className="flex items-center -ml-1">
            <div className="relative w-24 h-10">
              <Image
                src="/images/Logo.svg"
                alt="Luke Robert Hair"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium tracking-wide hover:text-sage transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/referrals" className="text-[13px] font-medium tracking-wide hover:text-sage transition-colors inline-flex items-center gap-1.5 whitespace-nowrap">
              Refer a Friend
              <span className="inline-block px-2 py-0.5 bg-purple-500 text-white text-[10px] rounded-full">£10 Off</span>
            </Link>
            <Link href="/book" className="px-5 py-2 bg-sage text-white rounded-full text-[13px] font-medium hover:bg-sage-dark transition-all hover:scale-105 whitespace-nowrap ml-2">
              Book Now
            </Link>
            <Link href="/admin" className="p-2 hover:bg-sage/10 rounded-lg transition-colors ml-1" title="CRM Login">
              <LogIn size={18} className="text-sage" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-sage/10 rounded-lg transition-colors"
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
            className="lg:hidden bg-offwhite border-t border-mist"
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
                href="/referrals"
                onClick={() => setIsOpen(false)}
                className="block text-lg font-medium hover:text-sage transition-colors"
              >
                <span className="flex items-center gap-2">
                  Refer a Friend
                  <span className="inline-block px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">£10 Off</span>
                </span>
              </Link>
              <Link
                href="/book"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-8 py-4 bg-sage text-white rounded-full font-medium hover:bg-sage/90 transition-colors"
              >
                Book Now
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-8 py-4 border-2 border-sage text-sage rounded-full font-medium hover:bg-sage hover:text-white transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={20} />
                  CRM Login
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
