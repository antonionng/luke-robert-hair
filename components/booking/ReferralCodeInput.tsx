'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Check, X, Loader2 } from 'lucide-react';
import { useBookingStore } from '@/lib/bookingStore';
import type { ValidateReferralResponse } from '@/lib/types';

export default function ReferralCodeInput() {
  const { client, referralCode, referralDiscount, setReferralCode } = useBookingStore();
  const [code, setCode] = useState(referralCode || '');
  const [isValidating, setIsValidating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!!referralCode);
  const [validationResult, setValidationResult] = useState<ValidateReferralResponse | null>(null);
  const [error, setError] = useState('');

  // Check URL for referral code on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode && !referralCode) {
      setCode(refCode.toUpperCase());
      setIsExpanded(true);
      // Auto-validate if we have email
      if (client.email) {
        validateCode(refCode, client.email);
      }
    }
  }, [client.email, referralCode]);

  const validateCode = async (codeToValidate: string, email: string) => {
    if (!codeToValidate || !email) return;

    setIsValidating(true);
    setError('');
    setValidationResult(null);

    try {
      const response = await fetch('/api/referrals/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToValidate,
          email,
        }),
      });

      const data: ValidateReferralResponse = await response.json();
      setValidationResult(data);

      if (data.valid && data.discount) {
        setReferralCode(codeToValidate.toUpperCase(), data.discount.value);
      } else {
        setError(data.message);
        setReferralCode(null, null);
      }
    } catch (err: any) {
      setError('Failed to validate code. Please try again.');
      setReferralCode(null, null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleApply = () => {
    if (!client.email) {
      setError('Please enter your email address first.');
      return;
    }
    validateCode(code, client.email);
  };

  const handleRemove = () => {
    setCode('');
    setReferralCode(null, null);
    setValidationResult(null);
    setError('');
  };

  return (
    <div className="space-y-4">
      {/* Collapsed Button */}
      {!isExpanded && !referralCode && (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          <Gift size={20} />
          Have a referral code?
        </button>
      )}

      {/* Expanded Form */}
      <AnimatePresence>
        {(isExpanded || referralCode) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="referral-card p-6 space-y-4"
          >
            {/* Success State */}
            {referralCode && validationResult?.valid && (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Check size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-graphite mb-1">
                    Referral Code Applied! 🎉
                  </p>
                  <p className="text-sm text-graphite/70 mb-2">
                    {validationResult.message}
                  </p>
                  <p className="text-lg font-bold text-purple-600">
                    {validationResult.discount?.formatted}
                  </p>
                </div>
                <button
                  onClick={handleRemove}
                  className="flex-shrink-0 p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <X size={18} className="text-graphite/60" />
                </button>
              </motion.div>
            )}

            {/* Input State */}
            {!referralCode && (
              <>
                <div className="flex items-start gap-2">
                  <Gift size={20} className="text-purple-600 mt-3" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-graphite mb-2">
                      Referral Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="LUKE-NAME-ABC"
                        className="flex-1 px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-graphite font-mono"
                        disabled={isValidating}
                      />
                      <button
                        onClick={handleApply}
                        disabled={!code || isValidating || !client.email}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isValidating ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Checking...
                          </>
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>
                    {!client.email && (
                      <p className="text-xs text-graphite/60 mt-2">
                        Enter your email address above to apply a referral code
                      </p>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <X size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </motion.div>
                )}

                {/* Collapse Button */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-sm text-graphite/60 hover:text-graphite transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

