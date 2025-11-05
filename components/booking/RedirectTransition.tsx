'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ExternalLink, MapPin, Phone } from 'lucide-react';

interface RedirectTransitionProps {
  customerName: string;
  salonName: string;
  salonCity: string;
  salonAddress: string;
  salonPhone: string;
  redirectUrl: string;
  autoRedirectSeconds?: number;
}

export default function RedirectTransition({
  customerName,
  salonName,
  salonCity,
  salonAddress,
  salonPhone,
  redirectUrl,
  autoRedirectSeconds = 5
}: RedirectTransitionProps) {
  const [countdown, setCountdown] = useState(autoRedirectSeconds);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasRedirected) {
            handleRedirect();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasRedirected]);

  const handleRedirect = () => {
    setHasRedirected(true);
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sage-pale via-offwhite to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-sage to-sage-dark text-white p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="relative"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={48} className="text-sage" />
              </div>
              <h1 className="text-3xl font-playfair font-light mb-2">
                Details Saved!
              </h1>
              <p className="text-lg text-white/90">
                Thank you, {customerName}!
              </p>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <p className="text-lg text-graphite mb-4">
                We've saved your details. Now connecting you to
              </p>
              <h2 className="text-2xl font-semibold text-graphite mb-2">
                {salonName}
              </h2>
              <p className="text-graphite/70">{salonCity}</p>
            </motion.div>

            {/* Salon Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-sage/5 rounded-2xl p-6 mb-6 space-y-3"
            >
              <div className="flex items-center gap-3 text-graphite/80">
                <MapPin size={20} className="text-sage flex-shrink-0" />
                <span>{salonAddress}</span>
              </div>
              <div className="flex items-center gap-3 text-graphite/80">
                <Phone size={20} className="text-sage flex-shrink-0" />
                <a href={`tel:${salonPhone}`} className="hover:text-sage transition-colors">
                  {salonPhone}
                </a>
              </div>
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center gap-2 text-graphite/60">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        countdown <= i ? 'bg-sage' : 'bg-graphite/20'
                      }`}
                      animate={{
                        scale: countdown === (5 - i) ? [1, 1.5, 1] : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  ))}
                </div>
                <span className="text-sm">
                  Redirecting in {countdown} {countdown === 1 ? 'second' : 'seconds'}...
                </span>
              </div>
            </motion.div>

            {/* Manual Continue Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={handleRedirect}
              disabled={hasRedirected}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full font-medium transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {hasRedirected ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  Continue to {salonName}
                  <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </motion.button>

            {/* Info Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-sm text-graphite/60 mt-6"
            >
              You'll complete your booking on {salonName}'s secure system
            </motion.p>
          </div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 text-sm text-graphite/60"
        >
          <p>
            Questions? Email us at <a href="mailto:hello@lukerobert.hair" className="text-sage hover:underline">hello@lukerobert.hair</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}






